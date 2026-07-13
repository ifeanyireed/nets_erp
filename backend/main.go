package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"strings"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

func main() {
	dsn := getDSN()
	var err error
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Error opening database connection: %v", err)
	}
	defer db.Close()

	// Verify database connection
	err = db.Ping()
	if err != nil {
		log.Printf("Warning: Database ping failed: %v", err)
	}

	// Register routes
	registerRoute("/users", handleUsers)
	registerRoute("/objectives", handleObjectives)
	registerRoute("/cycles", handleCycles)
	registerRoute("/reviews", handleReviews)
	registerRoute("/seed", handleSeed)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server listening on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

func registerRoute(path string, handler http.HandlerFunc) {
	http.HandleFunc(path, enableCORS(handler))
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

func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Max-Age", "3600")
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next(w, r)
	}
}
