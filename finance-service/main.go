package main

import (
	"bufio"
	"finance-service/db"
	"finance-service/handlers"
	"log"
	"net/http"
	"os"
	"strings"
)

func loadEnv(filepath string) {
	file, err := os.Open(filepath)
	if err != nil {
		log.Printf("Note: .env file not found at %s, relying on environment variables", filepath)
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "#") || strings.TrimSpace(line) == "" {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 {
			key := strings.TrimSpace(parts[0])
			value := strings.Trim(strings.TrimSpace(parts[1]), "\"")
			os.Setenv(key, value)
		}
	}
}

func main() {
	// Load environment variables
	loadEnv(".env")

	// Initialize database
	database, err := db.InitDB()
	if err != nil {
		log.Fatalf("Database initialization failed: %v", err)
	}
	defer database.Close()

	// Provide DB access to handlers
	handlers.SetDB(database)

	// Set up router & register routes
	registerRoutes()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8085"
	}

	log.Printf("Finance service listening on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Finance service failed to start: %v", err)
	}
}

func registerRoute(path string, handler http.HandlerFunc) {
	http.HandleFunc(path, enableCORS(handler))
}

func registerRoutes() {
	registerRoute("/stats", handlers.HandleStats)
	registerRoute("/expenses", handlers.HandleExpenses)
	registerRoute("/invoices", handlers.HandleInvoices)
	registerRoute("/reconciliations", handlers.HandleReconciliations)
	registerRoute("/transactions", handlers.HandleTransactions)
	registerRoute("/clients", handlers.HandleClients)
}

func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Max-Age", "3600")
		w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Expires", "0")
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next(w, r)
	}
}
