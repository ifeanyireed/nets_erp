package main

func registerRoutes() {
	registerRoute("/users", handleUsers)
	registerRoute("/objectives", handleObjectives)
	registerRoute("/cycles", handleCycles)
	registerRoute("/reviews", handleReviews)
	registerRoute("/seed", handleSeed)
	registerRoute("/send-reset-email", handleSendResetEmail)
	registerRoute("/send-bulk-notification", handleSendBulkNotification)
	registerRoute("/update-password", handleUpdatePassword)
}
