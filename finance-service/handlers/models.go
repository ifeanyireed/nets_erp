package handlers

import (
	"time"
)

type Expense struct {
	ID          string     `json:"id"`
	Title       string     `json:"title"`
	Category    string     `json:"category"`
	Amount      float64    `json:"amount"`
	Status      string     `json:"status"` // "Pending", "Approved", "Disbursed", "Rejected"
	RequestedBy string     `json:"requestedBy"`
	ApprovedBy  *string    `json:"approvedBy,omitempty"`
	Description *string    `json:"description,omitempty"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}

type Invoice struct {
	ID            string    `json:"id"`
	InvoiceNumber string    `json:"invoiceNumber"`
	CustomerName  string    `json:"customerName"`
	CustomerEmail string    `json:"customerEmail"`
	Amount        float64   `json:"amount"`
	DueDate       string    `json:"dueDate"`
	Status        string    `json:"status"` // "Unpaid", "Paid", "Overdue", "Cancelled"
	Description   *string   `json:"description,omitempty"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

type Reconciliation struct {
	ID             string    `json:"id"`
	Title          string    `json:"title"`
	Type           string    `json:"type"` // "Logistics", "KHLC", "Shuttle", "Rental Bus"
	PeriodStart    string    `json:"periodStart"`
	PeriodEnd      string    `json:"periodEnd"`
	ExpectedAmount float64   `json:"expectedAmount"`
	ActualAmount   float64   `json:"actualAmount"`
	Discrepancy    float64   `json:"discrepancy"`
	Status         string    `json:"status"` // "Pending", "Resolved", "Flagged"
	PreparedBy     string    `json:"preparedBy"`
	Notes          *string   `json:"notes,omitempty"`
	CreatedAt      time.Time `json:"createdAt"`
}

type Transaction struct {
	ID          string    `json:"id"`
	ReferenceID *string   `json:"referenceId,omitempty"`
	Type        string    `json:"type"` // "Credit" (Revenue) or "Debit" (Expense)
	Category    string    `json:"category"`
	Amount      float64   `json:"amount"`
	Date        string    `json:"date"`
	Description *string   `json:"description,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
}

type DashboardStats struct {
	TotalRevenue      float64 `json:"totalRevenue"`
	TotalExpenses     float64 `json:"totalExpenses"`
	PendingPayables   float64 `json:"pendingPayables"`
	OutstandingInvoice float64 `json:"outstandingInvoice"`
}
