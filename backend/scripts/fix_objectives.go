package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

type SeedData struct {
	Objectives [][]interface{} `json:"objectives"`
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

func main() {
	dsn := getDSN()
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Failed to open DB: %v", err)
	}
	defer db.Close()

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
	fmt.Println("Columns altered successfully!")

	// 2. Read seed_data.json
	fmt.Println("Reading seed_data.json...")
	seedBytes, err := os.ReadFile("seed_data.json")
	if err != nil {
		log.Fatalf("Failed to read seed_data.json: %v", err)
	}

	var data SeedData
	if err := json.Unmarshal(seedBytes, &data); err != nil {
		log.Fatalf("Failed to parse seed data: %v", err)
	}
	fmt.Printf("Parsed %d objectives from seed file.\n", len(data.Objectives))

	// 3. Truncate Objective table (safely with FK checks disabled)
	fmt.Println("Clearing Objective table...")
	_, err = db.Exec("SET FOREIGN_KEY_CHECKS = 0")
	if err != nil {
		log.Fatalf("Failed to disable foreign keys: %v", err)
	}
	_, err = db.Exec("TRUNCATE TABLE Objective")
	if err != nil {
		log.Fatalf("Failed to truncate table: %v", err)
	}
	_, err = db.Exec("SET FOREIGN_KEY_CHECKS = 1")
	if err != nil {
		log.Fatalf("Failed to re-enable foreign keys: %v", err)
	}

	// 4. Seed Objectives
	fmt.Println("Seeding clean objectives...")
	objStmt, err := db.Prepare("INSERT INTO Objective (id, text, weight, type, expectedLevel, category, departments, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
	if err != nil {
		log.Fatalf("Failed to prepare statement: %v", err)
	}
	defer objStmt.Close()

	insertedCount := 0
	for _, o := range data.Objectives {
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
		insertedCount++
	}

	fmt.Printf("Successfully restored %d objectives in database!\n", insertedCount)
}
