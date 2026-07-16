package main

import (
	"bufio"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"regexp"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

const dryRun = false // Change to false to execute write to the database

type DumpRecord struct {
	ID               string
	EmployeeId       string
	EmployeeName     string
	Department       string
	CycleId          string
	CycleName        string
	Status           string
	EmployeeComments string
	ManagerComments  string
	HrComments       string
	FinalScore       string
	ObjectivesJSON   string
	UpdatedAt        string
	ImprovementPlan  string
	SourceFile       string
	LineNum          int
}

type Objective struct {
	ID        string   `json:"id"`
	SelfScore *float64 `json:"selfScore"`
	Comments  *string  `json:"comments"`
}

func getDSN() string {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		return "u721451974_nets:*Reedb4b4@tcp(srv2113.hstgr.io:3306)/u721451974_nets_db?parseTime=true&loc=Local"
	}

	if strings.HasPrefix(dbURL, "mysql://") {
		dbURL = strings.TrimPrefix(dbURL, "mysql://")
		parts := strings.SplitN(dbURL, "@", 2)
		if len(parts) == 2 {
			creds := parts[0]
			hostPath := parts[1]
			hostParts := strings.SplitN(hostPath, "/", 2)
			if len(hostParts) == 2 {
				hostPort := hostParts[0]
				dbNameAndParams := hostParts[1]
				if !strings.Contains(dbNameAndParams, "parseTime=") {
					if strings.Contains(dbNameAndParams, "?") {
						dbNameAndParams += "&parseTime=true&loc=Local"
					} else {
						dbNameAndParams += "?parseTime=true&loc=Local"
					}
				}
				return fmt.Sprintf("%s@tcp(%s)/%s", creds, hostPort, dbNameAndParams)
			}
		}
	}
	return dbURL
}

func parseSQLDumpFile(filepath string, sourceName string) ([]DumpRecord, error) {
	file, err := os.Open(filepath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	buf := make([]byte, 1024*1024)
	scanner.Buffer(buf, 1024*1024)

	var records []DumpRecord
	lineNum := 0
	rowRegex := regexp.MustCompile(`^\s*\('REV[0-9]+[A-Z0-9]+'`)

	for scanner.Scan() {
		lineNum++
		line := scanner.Text()
		if rowRegex.MatchString(line) {
			r := parseLine(line, lineNum, sourceName)
			if r != nil {
				records = append(records, *r)
			}
		}
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}
	return records, nil
}

func parseLine(line string, lineNum int, sourceName string) *DumpRecord {
	line = strings.TrimSpace(line)
	if strings.HasPrefix(line, "(") {
		line = line[1:]
	}
	if strings.HasSuffix(line, ",") {
		line = line[:len(line)-1]
	}
	if strings.HasSuffix(line, ";") {
		line = line[:len(line)-1]
	}
	if strings.HasSuffix(line, ")") {
		line = line[:len(line)-1]
	}

	var fields []string
	var current strings.Builder
	inQuote := false
	var quoteChar byte

	for i := 0; i < len(line); i++ {
		char := line[i]
		if inQuote {
			if char == '\\' && i+1 < len(line) {
				current.WriteByte(char)
				current.WriteByte(line[i+1])
				i++
			} else if char == quoteChar {
				if i+1 < len(line) && line[i+1] == quoteChar {
					current.WriteByte(char)
					i++
				} else {
					inQuote = false
				}
			} else {
				current.WriteByte(char)
			}
		} else {
			if char == '\'' || char == '"' {
				inQuote = true
				quoteChar = char
			} else if char == ',' {
				fields = append(fields, current.String())
				current.Reset()
			} else {
				current.WriteByte(char)
			}
		}
	}
	fields = append(fields, current.String())

	if len(fields) < 13 {
		return nil
	}

	id := strings.TrimSpace(fields[0])
	empId := strings.TrimSpace(fields[1])
	empName := strings.TrimSpace(fields[2])
	dept := strings.TrimSpace(fields[3])
	cycleId := strings.TrimSpace(fields[4])
	cycleName := strings.TrimSpace(fields[5])
	status := strings.TrimSpace(fields[6])
	empComments := strings.TrimSpace(fields[7])
	mgrComments := strings.TrimSpace(fields[8])
	hrComments := strings.TrimSpace(fields[9])
	finalScore := strings.TrimSpace(fields[10])
	objJSON := strings.TrimSpace(fields[11])
	updatedAt := strings.TrimSpace(fields[12])
	
	var impPlan string
	if len(fields) > 13 {
		impPlan = strings.TrimSpace(fields[13])
	}

	return &DumpRecord{
		ID:               id,
		EmployeeId:       empId,
		EmployeeName:     empName,
		Department:       dept,
		CycleId:          cycleId,
		CycleName:        cycleName,
		Status:           status,
		EmployeeComments: empComments,
		ManagerComments:  mgrComments,
		HrComments:       hrComments,
		FinalScore:       finalScore,
		ObjectivesJSON:   objJSON,
		UpdatedAt:        updatedAt,
		ImprovementPlan:  impPlan,
		SourceFile:       sourceName,
		LineNum:          lineNum,
	}
}

func getScoreAndCommentCount(r DumpRecord) (int, int) {
	var objs []Objective
	cleanJSON := r.ObjectivesJSON
	cleanJSON = strings.ReplaceAll(cleanJSON, "\\\"", "\"")
	cleanJSON = strings.ReplaceAll(cleanJSON, "\\\\", "\\")

	scores := 0
	comments := 0
	err := json.Unmarshal([]byte(cleanJSON), &objs)
	if err == nil {
		for _, o := range objs {
			if o.SelfScore != nil {
				scores++
			}
			if o.Comments != nil && len(*o.Comments) > 0 {
				comments++
			}
		}
	}
	return scores, comments
}

// Compares two versions of the same review record and returns the one with more progress
func getBetterRecord(r1, r2 DumpRecord) DumpRecord {
	// Status priority
	statusWeight := map[string]int{
		"HR Approved":      4,
		"Manager Reviewed": 3,
		"Submitted":        2,
		"Returned":         1,
		"Draft":            0,
	}

	w1 := statusWeight[r1.Status]
	w2 := statusWeight[r2.Status]

	if w1 != w2 {
		if w1 > w2 {
			return r1
		}
		return r2
	}

	// Compare scores and comments counts
	scores1, comms1 := getScoreAndCommentCount(r1)
	scores2, comms2 := getScoreAndCommentCount(r2)

	totalEntries1 := scores1 + comms1
	totalEntries2 := scores2 + comms2

	if r1.EmployeeComments != "NULL" && len(r1.EmployeeComments) > 0 {
		totalEntries1++
	}
	if r1.ImprovementPlan != "NULL" && len(r1.ImprovementPlan) > 0 {
		totalEntries1++
	}

	if r2.EmployeeComments != "NULL" && len(r2.EmployeeComments) > 0 {
		totalEntries2++
	}
	if r2.ImprovementPlan != "NULL" && len(r2.ImprovementPlan) > 0 {
		totalEntries2++
	}

	if totalEntries1 >= totalEntries2 {
		return r1
	}
	return r2
}

func main() {
	dumpFiles := []struct {
		path string
		name string
	}{
		{"/Users/user/Downloads/nets_erp/u721451974_nets_db.20260715185623.sql", "6:56 PM Backup"},
		{"/Users/user/Downloads/nets_erp/PerformanceReview.sql", "10:28 PM Backup"},
		{"/Users/user/Downloads/nets_erp/u721451974_nets_db.sql", "11:32 PM Backup"},
	}

	mergedRecords := make(map[string]DumpRecord)

	for _, f := range dumpFiles {
		records, err := parseSQLDumpFile(f.path, f.name)
		if err != nil {
			log.Fatalf("Error parsing %s: %v", f.name, err)
		}

		for _, r := range records {
			existing, exists := mergedRecords[r.ID]
			if !exists {
				mergedRecords[r.ID] = r
			} else {
				mergedRecords[r.ID] = getBetterRecord(existing, r)
			}
		}
	}

	fmt.Printf("=== CONSOLIDATION REPORT (Total Merged Records: %d) ===\n", len(mergedRecords))
	submittedCount := 0
	populatedCount := 0

	for id, r := range mergedRecords {
		scores, comms := getScoreAndCommentCount(r)
		isPopulated := r.Status != "Draft" || scores > 0 || comms > 0 || (r.EmployeeComments != "NULL" && len(r.EmployeeComments) > 0)
		if isPopulated {
			populatedCount++
		}
		if r.Status != "Draft" {
			submittedCount++
		}

		if isPopulated {
			fmt.Printf("  ID: %-15s | Name: %-30s | Status: %-16s | Source: %-15s | Scores: %2d | Comments: %2d\n",
				id, r.EmployeeName, r.Status, r.SourceFile, scores, comms)
		}
	}

	fmt.Printf("\nSummary of Consolidation:\n")
	fmt.Printf("  - Total Submitted/Reviewed: %d\n", submittedCount)
	fmt.Printf("  - Total Reviews with inputs: %d\n", populatedCount)
	fmt.Printf("  - Dry Run Mode: %t\n", dryRun)

	if dryRun {
		fmt.Println("\n[DRY RUN] No database writes were executed. Set dryRun = false to perform database recovery.")
		return
	}

	// EXECUTE LIVE DATABASE RESTORE
	fmt.Println("\nExecuting live database recovery...")
	dsn := getDSN()
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}
	defer db.Close()

	// Disable foreign key checks
	_, err = db.Exec("SET FOREIGN_KEY_CHECKS = 0")
	if err != nil {
		log.Fatalf("Failed to disable foreign keys: %v", err)
	}

	// 1. ALTER TABLE to convert columns to TEXT
	fmt.Println("Altering columns departments and description to TEXT in MySQL...")
	_, err = db.Exec("ALTER TABLE Objective MODIFY departments TEXT")
	if err != nil {
		log.Fatalf("Failed to alter departments column: %v", err)
	}
	_, err = db.Exec("ALTER TABLE Objective MODIFY description TEXT")
	if err != nil {
		log.Fatalf("Failed to alter description column: %v", err)
	}
	fmt.Println("Objective table columns altered to TEXT successfully.")

	// 2. Load seed_data.json and re-seed Objectives
	fmt.Println("Reading seed_data.json to restore objectives...")
	seedBytes, err := os.ReadFile("seed_data.json")
	if err != nil {
		log.Fatalf("Failed to read seed_data.json: %v", err)
	}

	var seedData struct {
		Objectives [][]interface{} `json:"objectives"`
	}
	if err := json.Unmarshal(seedBytes, &seedData); err != nil {
		log.Fatalf("Failed to parse seed data: %v", err)
	}

	_, err = db.Exec("TRUNCATE TABLE Objective")
	if err != nil {
		log.Fatalf("Failed to truncate Objective table: %v", err)
	}

	objStmt, err := db.Prepare("INSERT INTO Objective (id, text, weight, type, expectedLevel, category, departments, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
	if err != nil {
		log.Fatalf("Failed to prepare Objective statement: %v", err)
	}
	defer objStmt.Close()

	for _, o := range seedData.Objectives {
		if len(o) > 4 && o[4] != nil {
			if f, ok := o[4].(float64); ok {
				o[4] = int(f)
			}
		}
		if len(o) > 2 && o[2] != nil {
			if f, ok := o[2].(float64); ok {
				o[2] = int(f)
			}
		}
		if _, err := objStmt.Exec(o...); err != nil {
			log.Fatalf("Failed to seed objective: %v", err)
		}
	}
	fmt.Printf("Successfully restored %d objectives in database!\n", len(seedData.Objectives))

	// We clear the PerformanceReview table and insert the consolidated rows
	_, err = db.Exec("TRUNCATE TABLE PerformanceReview")
	if err != nil {
		log.Fatalf("Failed to truncate PerformanceReview table: %v", err)
	}

	stmt, err := db.Prepare(`INSERT INTO PerformanceReview (
		id, employeeId, employeeName, department, cycleId, cycleName, status, 
		employeeComments, managerComments, hrComments, finalScore, objectivesJson, updatedAt, improvementPlan
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
	if err != nil {
		log.Fatalf("Failed to prepare statement: %v", err)
	}
	defer stmt.Close()

	insertedCount := 0
	for _, r := range mergedRecords {
		var empComments, mgrComments, hrComments, finalScore, impPlan interface{}

		if r.EmployeeComments != "NULL" {
			empComments = cleanSQLString(r.EmployeeComments)
		}
		if r.ManagerComments != "NULL" {
			mgrComments = cleanSQLString(r.ManagerComments)
		}
		if r.HrComments != "NULL" {
			hrComments = cleanSQLString(r.HrComments)
		}
		if r.FinalScore != "NULL" {
			finalScore = r.FinalScore
		}
		if r.ImprovementPlan != "NULL" {
			impPlan = cleanSQLString(r.ImprovementPlan)
		}

		cleanObjectives := cleanSQLString(r.ObjectivesJSON)

		_, err = stmt.Exec(
			r.ID, r.EmployeeId, r.EmployeeName, r.Department, r.CycleId, r.CycleName, r.Status,
			empComments, mgrComments, hrComments, finalScore, cleanObjectives, r.UpdatedAt, impPlan,
		)
		if err != nil {
			log.Fatalf("Failed to insert record %s: %v", r.ID, err)
		}
		insertedCount++
	}

	// Re-enable foreign key checks
	_, err = db.Exec("SET FOREIGN_KEY_CHECKS = 1")
	if err != nil {
		log.Fatalf("Failed to re-enable foreign keys: %v", err)
	}

	fmt.Printf("Live restore completed successfully! Restored %d records to PerformanceReview table.\n", insertedCount)
}

func cleanSQLString(s string) string {
	if s == "NULL" {
		return s
	}
	// Unescape SQL escaped characters
	s = strings.ReplaceAll(s, `''`, `'`)
	s = strings.ReplaceAll(s, `\"`, `"`)
	s = strings.ReplaceAll(s, `\'`, `'`)
	s = strings.ReplaceAll(s, `\\`, `\`)
	return s
}
