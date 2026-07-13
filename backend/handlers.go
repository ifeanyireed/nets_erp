package main

import (
	"database/sql"
	_ "embed"
	"encoding/json"
	"net/http"
)

//go:embed seed_data.json
var seedDataBytes []byte

type User struct {
	ID             string           `json:"id"`
	Name           string           `json:"name"`
	Email          string           `json:"email"`
	Role           string           `json:"role"`
	Department     string           `json:"department"`
	Avatar         string           `json:"avatar"`
	ManagerName    *string          `json:"managerName"`
	RatingTrend    *json.RawMessage `json:"ratingTrend"`
	Designation    *string          `json:"designation"`
	GradeLevel     *string          `json:"gradeLevel"`
	EmploymentDate *string          `json:"employmentDate"`
	Company        *string          `json:"company"`
	Location       *string          `json:"location"`
	Password       *string          `json:"password"`
}

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

type ReviewCycle struct {
	ID          string           `json:"id"`
	Name        string           `json:"name"`
	StartDate   string           `json:"startDate"`
	EndDate     string           `json:"endDate"`
	Status      string           `json:"status"`
	Departments *json.RawMessage `json:"departments"`
}

type PerformanceReview struct {
	ID               string           `json:"id"`
	EmployeeID       string           `json:"employeeId"`
	EmployeeName     string           `json:"employeeName"`
	Department       string           `json:"department"`
	CycleID          string           `json:"cycleId"`
	CycleName        string           `json:"cycleName"`
	Status           string           `json:"status"`
	EmployeeComments *string          `json:"employeeComments"`
	ManagerComments  *string          `json:"managerComments"`
	HRComments       *string          `json:"hrComments"`
	FinalScore       *float64         `json:"finalScore"`
	Objectives       *json.RawMessage `json:"objectives"` // Maps to objectivesJson in DB
	UpdatedAt        string           `json:"updatedAt"`
}

func handleUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		id := r.URL.Query().Get("id")
		if id != "" {
			var u User
			var ratingTrend sql.NullString
			err := db.QueryRow("SELECT id, name, email, role, department, avatar, managerName, ratingTrend, designation, gradeLevel, employmentDate, company, location, password FROM User WHERE id = ?", id).
				Scan(&u.ID, &u.Name, &u.Email, &u.Role, &u.Department, &u.Avatar, &u.ManagerName, &ratingTrend, &u.Designation, &u.GradeLevel, &u.EmploymentDate, &u.Company, &u.Location, &u.Password)
			if err == sql.ErrNoRows {
				w.WriteHeader(http.StatusNotFound)
				json.NewEncoder(w).Encode(map[string]string{"message": "User not found"})
				return
			} else if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			if ratingTrend.Valid && ratingTrend.String != "" {
				raw := json.RawMessage(ratingTrend.String)
				u.RatingTrend = &raw
			}
			json.NewEncoder(w).Encode(u)
			return
		}

		rows, err := db.Query("SELECT id, name, email, role, department, avatar, managerName, ratingTrend, designation, gradeLevel, employmentDate, company, location, password FROM User")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		defer rows.Close()

		users := []User{}
		for rows.Next() {
			var u User
			var ratingTrend sql.NullString
			if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.Role, &u.Department, &u.Avatar, &u.ManagerName, &ratingTrend, &u.Designation, &u.GradeLevel, &u.EmploymentDate, &u.Company, &u.Location, &u.Password); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			if ratingTrend.Valid && ratingTrend.String != "" {
				raw := json.RawMessage(ratingTrend.String)
				u.RatingTrend = &raw
			}
			users = append(users, u)
		}
		json.NewEncoder(w).Encode(users)

	} else if r.Method == http.MethodPost || r.Method == http.MethodPut {
		var u User
		if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
			return
		}
		if u.ID == "" || u.Name == "" || u.Email == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Incomplete parameters"})
			return
		}

		var ratingTrendStr *string
		if u.RatingTrend != nil {
			s := string(*u.RatingTrend)
			ratingTrendStr = &s
		}

		_, err := db.Exec(`INSERT INTO User (id, name, email, role, department, avatar, managerName, ratingTrend, designation, gradeLevel, employmentDate, company, location, password) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON DUPLICATE KEY UPDATE 
			name = VALUES(name), email = VALUES(email), role = VALUES(role), department = VALUES(department), 
			avatar = VALUES(avatar), managerName = VALUES(managerName), ratingTrend = VALUES(ratingTrend),
			designation = VALUES(designation), gradeLevel = VALUES(gradeLevel), employmentDate = VALUES(employmentDate),
			company = VALUES(company), location = VALUES(location), password = VALUES(password)`,
			u.ID, u.Name, u.Email, u.Role, u.Department, u.Avatar, u.ManagerName, ratingTrendStr, u.Designation, u.GradeLevel, u.EmploymentDate, u.Company, u.Location, u.Password)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "User upserted successfully"})
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func handleObjectives(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		rows, err := db.Query("SELECT id, text, weight, type, expectedLevel, category, departments, description FROM Objective")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		defer rows.Close()

		objs := []Objective{}
		for rows.Next() {
			var o Objective
			var depts, desc sql.NullString
			if err := rows.Scan(&o.ID, &o.Text, &o.Weight, &o.Type, &o.ExpectedLevel, &o.Category, &depts, &desc); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			if depts.Valid && depts.String != "" {
				raw := json.RawMessage(depts.String)
				o.Departments = &raw
			}
			if desc.Valid && desc.String != "" {
				raw := json.RawMessage(desc.String)
				o.Description = &raw
			}
			objs = append(objs, o)
		}
		json.NewEncoder(w).Encode(objs)

	} else if r.Method == http.MethodPost {
		var o Objective
		if err := json.NewDecoder(r.Body).Decode(&o); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
			return
		}
		if o.ID == "" || o.Text == "" || o.Weight == 0 || o.Type == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Incomplete parameters"})
			return
		}

		var deptsStr, descStr *string
		if o.Departments != nil {
			s := string(*o.Departments)
			deptsStr = &s
		}
		if o.Description != nil {
			s := string(*o.Description)
			descStr = &s
		}

		_, err := db.Exec(`INSERT INTO Objective (id, text, weight, type, expectedLevel, category, departments, description) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)
			ON DUPLICATE KEY UPDATE text = VALUES(text), weight = VALUES(weight), type = VALUES(type), 
			expectedLevel = VALUES(expectedLevel), category = VALUES(category), departments = VALUES(departments), description = VALUES(description)`,
			o.ID, o.Text, o.Weight, o.Type, o.ExpectedLevel, o.Category, deptsStr, descStr)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Objective upserted successfully"})

	} else if r.Method == http.MethodDelete {
		id := r.URL.Query().Get("id")
		if id == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Objective ID required"})
			return
		}
		_, err := db.Exec("DELETE FROM Objective WHERE id = ?", id)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Objective deleted"})
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func handleCycles(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		rows, err := db.Query("SELECT id, name, startDate, endDate, status, departments FROM ReviewCycle")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		defer rows.Close()

		cycles := []ReviewCycle{}
		for rows.Next() {
			var c ReviewCycle
			var depts sql.NullString
			if err := rows.Scan(&c.ID, &c.Name, &c.StartDate, &c.EndDate, &c.Status, &depts); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			if depts.Valid && depts.String != "" {
				raw := json.RawMessage(depts.String)
				c.Departments = &raw
			}
			cycles = append(cycles, c)
		}
		json.NewEncoder(w).Encode(cycles)

	} else if r.Method == http.MethodPost || r.Method == http.MethodPut {
		var c ReviewCycle
		if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
			return
		}
		if c.ID == "" || c.Name == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Incomplete parameters"})
			return
		}

		var deptsStr string = "[]"
		if c.Departments != nil {
			deptsStr = string(*c.Departments)
		}

		_, err := db.Exec(`INSERT INTO ReviewCycle (id, name, startDate, endDate, status, departments) 
			VALUES (?, ?, ?, ?, ?, ?)
			ON DUPLICATE KEY UPDATE 
			name = VALUES(name), startDate = VALUES(startDate), endDate = VALUES(endDate), status = VALUES(status), departments = VALUES(departments)`,
			c.ID, c.Name, c.StartDate, c.EndDate, c.Status, deptsStr)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Cycle upserted successfully"})
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func handleReviews(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		id := r.URL.Query().Get("id")
		employeeId := r.URL.Query().Get("employeeId")

		if id != "" {
			var pr PerformanceReview
			var objJSON sql.NullString
			err := db.QueryRow("SELECT id, employeeId, employeeName, department, cycleId, cycleName, status, employeeComments, managerComments, hrComments, finalScore, objectivesJson, updatedAt FROM PerformanceReview WHERE id = ?", id).
				Scan(&pr.ID, &pr.EmployeeID, &pr.EmployeeName, &pr.Department, &pr.CycleID, &pr.CycleName, &pr.Status, &pr.EmployeeComments, &pr.ManagerComments, &pr.HRComments, &pr.FinalScore, &objJSON, &pr.UpdatedAt)
			if err == sql.ErrNoRows {
				w.WriteHeader(http.StatusNotFound)
				json.NewEncoder(w).Encode(map[string]string{"message": "Review not found"})
				return
			} else if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			if objJSON.Valid && objJSON.String != "" {
				raw := json.RawMessage(objJSON.String)
				pr.Objectives = &raw
			}
			json.NewEncoder(w).Encode(pr)
			return
		}

		var rows *sql.Rows
		var err error
		if employeeId != "" {
			rows, err = db.Query("SELECT id, employeeId, employeeName, department, cycleId, cycleName, status, employeeComments, managerComments, hrComments, finalScore, objectivesJson, updatedAt FROM PerformanceReview WHERE employeeId = ?", employeeId)
		} else {
			rows, err = db.Query("SELECT id, employeeId, employeeName, department, cycleId, cycleName, status, employeeComments, managerComments, hrComments, finalScore, objectivesJson, updatedAt FROM PerformanceReview")
		}

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		defer rows.Close()

		reviews := []PerformanceReview{}
		for rows.Next() {
			var pr PerformanceReview
			var objJSON sql.NullString
			if err := rows.Scan(&pr.ID, &pr.EmployeeID, &pr.EmployeeName, &pr.Department, &pr.CycleID, &pr.CycleName, &pr.Status, &pr.EmployeeComments, &pr.ManagerComments, &pr.HRComments, &pr.FinalScore, &objJSON, &pr.UpdatedAt); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			if objJSON.Valid && objJSON.String != "" {
				raw := json.RawMessage(objJSON.String)
				pr.Objectives = &raw
			}
			reviews = append(reviews, pr)
		}
		json.NewEncoder(w).Encode(reviews)

	} else if r.Method == http.MethodPost || r.Method == http.MethodPut {
		var pr PerformanceReview
		if err := json.NewDecoder(r.Body).Decode(&pr); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
			return
		}
		if pr.ID == "" || pr.EmployeeID == "" || pr.CycleID == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Incomplete parameters"})
			return
		}

		var objJSONStr string = "[]"
		if pr.Objectives != nil {
			objJSONStr = string(*pr.Objectives)
		}

		_, err := db.Exec(`INSERT INTO PerformanceReview 
			(id, employeeId, employeeName, department, cycleId, cycleName, status, employeeComments, managerComments, hrComments, finalScore, objectivesJson, updatedAt) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
			ON DUPLICATE KEY UPDATE 
			status = VALUES(status), employeeComments = VALUES(employeeComments), managerComments = VALUES(managerComments), hrComments = VALUES(hrComments), 
			finalScore = VALUES(finalScore), objectivesJson = VALUES(objectivesJson), updatedAt = NOW()`,
			pr.ID, pr.EmployeeID, pr.EmployeeName, pr.Department, pr.CycleID, pr.CycleName, pr.Status, pr.EmployeeComments, pr.ManagerComments, pr.HRComments, pr.FinalScore, objJSONStr)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Review upserted successfully"})
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

type SeedData struct {
	Users      [][]interface{} `json:"users"`
	Cycles     [][]interface{} `json:"cycles"`
	Objectives [][]interface{} `json:"objectives"`
	Reviews    [][]interface{} `json:"reviews"`
}

func handleSeed(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "Method not allowed. Use POST."})
		return
	}

	var data SeedData
	if err := json.Unmarshal(seedDataBytes, &data); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to parse seed data: " + err.Error()})
		return
	}

	// Truncate tables
	tx, err := db.Begin()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to start transaction: " + err.Error()})
		return
	}
	defer tx.Rollback()

	_, _ = tx.Exec("SET FOREIGN_KEY_CHECKS = 0")
	_, _ = tx.Exec("TRUNCATE TABLE User")
	_, _ = tx.Exec("TRUNCATE TABLE ReviewCycle")
	_, _ = tx.Exec("TRUNCATE TABLE Objective")
	_, _ = tx.Exec("TRUNCATE TABLE PerformanceReview")
	_, _ = tx.Exec("SET FOREIGN_KEY_CHECKS = 1")

	// Seed Users
	userStmt, err := tx.Prepare("INSERT INTO User (id, name, email, role, department, avatar, managerName, ratingTrend, designation, gradeLevel, employmentDate, company, location, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to prepare User stmt: " + err.Error()})
		return
	}
	defer userStmt.Close()

	for _, u := range data.Users {
		if len(u) > 7 && u[7] != nil {
			if s, ok := u[7].(string); ok {
				u[7] = s
			}
		}
		if _, err := userStmt.Exec(u...); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Failed to seed User: " + err.Error()})
			return
		}
	}

	// Seed Cycles
	cycleStmt, err := tx.Prepare("INSERT INTO ReviewCycle (id, name, startDate, endDate, status, departments) VALUES (?, ?, ?, ?, ?, ?)")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to prepare ReviewCycle stmt: " + err.Error()})
		return
	}
	defer cycleStmt.Close()

	for _, c := range data.Cycles {
		if _, err := cycleStmt.Exec(c...); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Failed to seed ReviewCycle: " + err.Error()})
			return
		}
	}

	// Seed Objectives
	objStmt, err := tx.Prepare("INSERT INTO Objective (id, text, weight, type, expectedLevel, category, departments, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to prepare Objective stmt: " + err.Error()})
		return
	}
	defer objStmt.Close()

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
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Failed to seed Objective: " + err.Error()})
			return
		}
	}

	// Seed Reviews
	revStmt, err := tx.Prepare("INSERT INTO PerformanceReview (id, employeeId, employeeName, department, cycleId, cycleName, status, employeeComments, managerComments, hrComments, finalScore, objectivesJson, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to prepare PerformanceReview stmt: " + err.Error()})
		return
	}
	defer revStmt.Close()

	for _, r := range data.Reviews {
		if len(r) > 10 && r[10] != nil {
			if f, ok := r[10].(float64); ok {
				r[10] = f
			}
		}
		if _, err := revStmt.Exec(r...); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Failed to seed PerformanceReview: " + err.Error()})
			return
		}
	}

	if err := tx.Commit(); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to commit transaction: " + err.Error()})
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Database seeded with departments and their respective JDs KPIs successfully!"})
}
