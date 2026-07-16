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

type Objective struct {
	ID            string           `json:"id"`
	Text          string           `json:"text"`
	Weight        int              `json:"weight"`
	Type          string           `json:"type"`
	ExpectedLevel *int             `json:"expectedLevel"`
	Category      *string          `json:"category"`
	Departments   *json.RawMessage `json:"departments"`
	Description   *json.RawMessage `json:"description"`
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

	rows, err := db.Query("SELECT id, text, weight, type, expectedLevel, category, departments, description FROM Objective")
	if err != nil {
		log.Fatalf("Query err: %v", err)
	}
	defer rows.Close()

	var objectives []Objective
	for rows.Next() {
		var o Objective
		var deptsJSON, descJSON sql.NullString

		if err := rows.Scan(&o.ID, &o.Text, &o.Weight, &o.Type, &o.ExpectedLevel, &o.Category, &deptsJSON, &descJSON); err != nil {
			log.Fatalf("Scan err: %v", err)
		}

		if deptsJSON.Valid && deptsJSON.String != "" {
			raw := json.RawMessage(deptsJSON.String)
			o.Departments = &raw
		}
		if descJSON.Valid && descJSON.String != "" {
			raw := json.RawMessage(descJSON.String)
			o.Description = &raw
		}

		objectives = append(objectives, o)
	}

	fmt.Printf("Successfully scanned %d objectives!\n", len(objectives))

	bytes, err := json.Marshal(objectives)
	if err != nil {
		log.Fatalf("Marshal err: %v", err)
	}

	fmt.Printf("Successfully marshaled %d bytes of JSON!\n", len(bytes))
}
