package main

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"strings"
)

// Send SMTP Email via Hostinger
func sendEmail(to, subject, htmlBody string) error {
	smtpHost := os.Getenv("SMTP_HOST")
	if smtpHost == "" {
		smtpHost = "smtp.hostinger.com"
	}
	smtpPort := os.Getenv("SMTP_PORT")
	if smtpPort == "" {
		smtpPort = "587"
	}
	smtpUser := os.Getenv("SMTP_USER")
	if smtpUser == "" {
		smtpUser = "hello@resultspro.ng"
	}
	smtpPassword := os.Getenv("SMTP_PASSWORD")
	if smtpPassword == "" {
		smtpPassword = "*Reedb4b4"
	}
	fromEmail := os.Getenv("SMTP_FROM_EMAIL")
	if fromEmail == "" {
		fromEmail = "hr@neweratransports.com"
	}

	auth := smtp.PlainAuth("", smtpUser, smtpPassword, smtpHost)

	// Compose headers and body
	headerFrom := fmt.Sprintf("From: New Era HR <%s>\r\n", fromEmail)
	headerTo := fmt.Sprintf("To: %s\r\n", to)
	headerSubject := fmt.Sprintf("Subject: %s\r\n", subject)
	headerMime := "MIME-Version: 1.0\r\n"
	headerContentType := "Content-Type: text/html; charset=UTF-8\r\n"
	body := fmt.Sprintf("\r\n%s\r\n", htmlBody)

	msg := []byte(headerFrom + headerTo + headerSubject + headerMime + headerContentType + body)

	addr := fmt.Sprintf("%s:%s", smtpHost, smtpPort)
	err := smtp.SendMail(addr, auth, smtpUser, []string{to}, msg)
	if err != nil {
		log.Printf("Error sending email to %s: %v", to, err)
		return err
	}
	return nil
}

// SHA256 Token generator for password resets
func generateResetToken(email, currentPassword string) string {
	sum := sha256.Sum256([]byte(email + currentPassword + "nets_secret_salt"))
	return fmt.Sprintf("%x", sum)
}

func handleSendResetEmail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req ResetEmailRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	origin := r.Header.Get("Origin")
	if origin == "" {
		origin = "https://nets.reedbreed.cc"
	}

	// Fetch users from database
	tx, err := db.Begin()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	rows, err := tx.Query("SELECT id, name, email, password FROM User")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	userMap := make(map[string]User)
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.Password); err != nil {
			continue
		}
		userMap[u.ID] = u
	}

	successCount := 0
	for _, id := range req.UserIDs {
		u, ok := userMap[id]
		if !ok || u.Email == "" {
			continue
		}

		pwd := ""
		if u.Password != nil {
			pwd = *u.Password
		}
		token := generateResetToken(u.Email, pwd)
		resetLink := fmt.Sprintf("%s/reset-password?email=%s&token=%s", origin, u.Email, token)

		htmlBody := fmt.Sprintf(`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background-color: #1e3a8a; padding: 30px 20px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
        .content { padding: 40px 30px; color: #334155; line-height: 1.6; }
        .content h2 { color: #1e3a8a; font-size: 18px; font-weight: 700; margin-top: 0; }
        .content p { font-size: 14px; margin-bottom: 24px; }
        .btn-wrapper { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; padding: 12px 30px; background-color: #2563eb; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; text-align: center; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Era Transport Services</h1>
        </div>
        <div class="content">
            <h2>Reset Your Password</h2>
            <p>Hello %s,</p>
            <p>A request has been made to reset the password for your account on the New Era Performance Portal. Click the button below to choose a new password:</p>
            <div class="btn-wrapper">
                <a href="%s" class="btn">Reset Password</a>
            </div>
            <p>If you did not request this password reset, please ignore this email or contact HR.</p>
            <p>Best regards,<br>New Era HR Team</p>
        </div>
        <div class="footer">
            &copy; 2026 New Era Transport Services. All rights reserved.
        </div>
    </div>
</body>
</html>`, u.Name, resetLink)

		// Send email in a goroutine so it doesn't block the HTTP thread
		go func(toEmail, subject, body string) {
			_ = sendEmail(toEmail, subject, body)
		}(u.Email, "Reset Your Password - New Era Performance Portal", htmlBody)

		successCount++
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"sent":   successCount,
	})
}

func handleSendBulkNotification(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req BulkNotificationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	if req.Subject == "" || req.Message == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Subject and Message are required"})
		return
	}

	// Fetch users from database
	tx, err := db.Begin()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	rows, err := tx.Query("SELECT id, name, email FROM User")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	userMap := make(map[string]User)
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.ID, &u.Name, &u.Email); err != nil {
			continue
		}
		userMap[u.ID] = u
	}

	successCount := 0
	for _, id := range req.UserIDs {
		u, ok := userMap[id]
		if !ok || u.Email == "" {
			continue
		}

		// Convert plain text newlines to HTML line breaks
		formattedMsg := strings.ReplaceAll(req.Message, "\n", "<br>")

		htmlBody := fmt.Sprintf(`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background-color: #1e3a8a; padding: 30px 20px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
        .content { padding: 40px 30px; color: #334155; line-height: 1.6; }
        .content h2 { color: #1e3a8a; font-size: 18px; font-weight: 700; margin-top: 0; }
        .content p { font-size: 14px; margin-bottom: 24px; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Era Transport Services</h1>
        </div>
        <div class="content">
            <h2>Notification Alert</h2>
            <p>Hello %s,</p>
            <p>%s</p>
            <p>Best regards,<br>New Era Performance Portal Team</p>
        </div>
        <div class="footer">
            &copy; 2026 New Era Transport Services. All rights reserved.
        </div>
    </div>
</body>
</html>`, u.Name, formattedMsg)

		// Send email in a goroutine so it doesn't block the HTTP thread
		go func(toEmail, subject, body string) {
			_ = sendEmail(toEmail, subject, body)
		}(u.Email, req.Subject, htmlBody)

		successCount++
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"sent":   successCount,
	})
}

func handleUpdatePassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req UpdatePasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	if req.Email == "" || req.Token == "" || req.NewPassword == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Email, Token, and new password are required"})
		return
	}

	// Fetch user from database
	tx, err := db.Begin()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	var u User
	var pwd string
	err = tx.QueryRow("SELECT id, name, email, password FROM User WHERE email = ?", req.Email).Scan(&u.ID, &u.Name, &u.Email, &pwd)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
		return
	}

	// Validate token
	expectedToken := generateResetToken(u.Email, pwd)
	if req.Token != expectedToken {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid or expired password reset link"})
		return
	}

	// Update password in database
	_, err = tx.Exec("UPDATE User SET password = ? WHERE email = ?", req.NewPassword, req.Email)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to update password: " + err.Error()})
		return
	}

	if err := tx.Commit(); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Password updated successfully"})
}
