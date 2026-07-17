"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useERPStore, User } from "@/lib/erp-store";
import ERPLayout from "@/components/nets_erp/Layout";
import { IconClipboardList, IconCalendarClock, IconReceipt, IconReportMoney, IconChevronRight } from "@tabler/icons-react";

// Microservice backend base URL
const FINANCE_API_URL = process.env.NEXT_PUBLIC_FINANCE_API_URL || "http://localhost:8085";

interface Expense {
	id: string;
	title: string;
	category: string;
	amount: number;
	status: string;
	requestedBy: string;
	approvedBy?: string;
	description?: string;
	createdAt: string;
}

interface Invoice {
	id: string;
	invoiceNumber: string;
	customerName: string;
	customerEmail: string;
	amount: number;
	dueDate: string;
	status: string;
	description?: string;
	createdAt: string;
}

interface Reconciliation {
	id: string;
	title: string;
	type: string;
	periodStart: string;
	periodEnd: string;
	expectedAmount: number;
	actualAmount: number;
	discrepancy: number;
	status: string;
	preparedBy: string;
	notes?: string;
	createdAt: string;
}

interface Transaction {
	id: string;
	referenceId?: string;
	type: string; // "Credit" or "Debit"
	category: string;
	amount: number;
	date: string;
	description?: string;
	createdAt: string;
}

interface Stats {
	totalRevenue: number;
	totalExpenses: number;
	pendingPayables: number;
	outstandingInvoice: number;
}

export default function AccountantDashboard() {
	const router = useRouter();
	const { users } = useERPStore();
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	// Tabs: "overview" | "invoices" | "expenses" | "reconcile" | "ledger"
	const [activeTab, setActiveTab] = useState<string>("overview");

	// Microservice state
	const [stats, setStats] = useState<Stats>({ totalRevenue: 0, totalExpenses: 0, pendingPayables: 0, outstandingInvoice: 0 });
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [reconciliations, setReconciliations] = useState<Reconciliation[]>([]);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Form Modals states
	const [showInvoiceModal, setShowInvoiceModal] = useState(false);
	const [showExpenseModal, setShowExpenseModal] = useState(false);
	const [showReconcileModal, setShowReconcileModal] = useState(false);

	// New records states
	const [newInvoice, setNewInvoice] = useState({
		customerName: "",
		customerEmail: "",
		amount: "",
		dueDate: "",
		description: ""
	});

	const [newExpense, setNewExpense] = useState({
		title: "",
		category: "Fleet Operations",
		amount: "",
		description: ""
	});

	const [newReconcile, setNewReconcile] = useState({
		title: "",
		type: "Shuttle",
		periodStart: "",
		periodEnd: "",
		expectedAmount: "",
		actualAmount: "",
		notes: ""
	});

	// Chart of Accounts (COA) state
	const [accountsList, setAccountsList] = useState([
		{ code: "1000", name: "Cash and Bank", type: "Assets", isDebit: true, baseVal: 12000000 },
		{ code: "1001", name: "GTB Operating Account", type: "Assets", isDebit: true, baseVal: 3850000 },
		{ code: "1100", name: "Accounts Receivable", type: "Assets", isDebit: true, useOutstandingInvoice: true },
		{ code: "1300", name: "Fixed Assets (Fleet Vehicles)", type: "Assets", isDebit: true, baseVal: 45000000 },
		{ code: "1390", name: "Accumulated Depreciation", type: "Assets", isDebit: false, baseVal: 15000000 },
		{ code: "2000", name: "Accounts Payable", type: "Liabilities", isDebit: false, usePendingPayables: true },
		{ code: "2100", name: "Tax Payable", type: "Liabilities", isDebit: false, baseVal: 3.75 },
		{ code: "3000", name: "Owner Equity", type: "Equity", isDebit: false, useEquity: true },
		{ code: "10010", name: "REVENUE - IHS OUTSOURCED DRIVERS", type: "Income", isDebit: false, revenueRatio: 0.4 },
		{ code: "10020", name: "REVENUE - IHS STAFF BUS", type: "Income", isDebit: false, revenueRatio: 0.3 },
		{ code: "10130", name: "REVENUE - SHUTTLE CONTRACTS", type: "Income", isDebit: false, revenueRatio: 0.3 },
		{ code: "20010", name: "HIACE/STAFF BUS REPAIR & MAINTENANCE", type: "Expenses", isDebit: true, expenseRatio: 0.5 },
		{ code: "20020", name: "FLEET REPAIR AND MAINTENANCE - IHS", type: "Expenses", isDebit: true, expenseRatio: 0.3 },
		{ code: "30060", name: "SALARY AND WAGES", type: "Expenses", isDebit: true, expenseRatio: 0.2 }
	]);
	const [coaSearchQuery, setCoaSearchQuery] = useState("");
	const [coaFilterType, setCoaFilterType] = useState("All");
	const [showAddAccountModal, setShowAddAccountModal] = useState(false);
	const [newAccount, setNewAccount] = useState({
		code: "",
		name: "",
		type: "Assets",
		isDebit: "true",
		baseVal: ""
	});

	const [ledgerSearchQuery, setLedgerSearchQuery] = useState("");

	// Fetch all data from the finance microservice
	const fetchFinanceData = async () => {
		setLoading(true);
		try {
			// Fetch Stats
			const statsRes = await fetch(`${FINANCE_API_URL}/stats`);
			const statsData = statsRes.ok ? await statsRes.json() : { totalRevenue: 1500000, totalExpenses: 760000, pendingPayables: 310000, outstandingInvoice: 4250000 };
			setStats(statsData);

			// Fetch Expenses
			const expRes = await fetch(`${FINANCE_API_URL}/expenses`);
			const expData = expRes.ok ? await expRes.json() : [];
			setExpenses(expData);

			// Fetch Invoices
			const invRes = await fetch(`${FINANCE_API_URL}/invoices`);
			const invData = invRes.ok ? await invRes.json() : [];
			setInvoices(invData);

			// Fetch Reconciliations
			const recRes = await fetch(`${FINANCE_API_URL}/reconciliations`);
			const recData = recRes.ok ? await recRes.json() : [];
			setReconciliations(recData);

			// Fetch Transactions
			const txRes = await fetch(`${FINANCE_API_URL}/transactions`);
			const txData = txRes.ok ? await txRes.json() : [];
			setTransactions(txData);

			setError(null);
		} catch (err: any) {
			console.error("Error loading finance service details: ", err);
			setError("Unable to connect to the Finance microservice. Displaying cached local records.");
			loadLocalFallback();
		} finally {
			setLoading(false);
		}
	};

	const loadLocalFallback = () => {
		// Mock stats
		setStats({
			totalRevenue: 2420000,
			totalExpenses: 760000,
			pendingPayables: 310000,
			outstandingInvoice: 4250000
		});

		// Mock expenses
		setExpenses([
			{ id: "exp-1", title: "Weekly Fuel Imprest - Lagos Fleet", category: "Fleet Operations", amount: 450000, status: "Approved", requestedBy: "Arotile Rotimi Seyi", createdAt: "2026-07-15T10:00:00Z" },
			{ id: "exp-2", title: "Office Internet Subscription", category: "Office Administration", amount: 75000, status: "Approved", requestedBy: "Emmanuel Victor Okon", createdAt: "2026-07-12T08:30:00Z" },
			{ id: "exp-3", title: "Bus Repair & Spare Parts (Bus 04)", category: "Fleet Operations", amount: 280000, status: "Pending", requestedBy: "Arotile Rotimi Seyi", createdAt: "2026-07-16T14:15:00Z" },
			{ id: "exp-4", title: "Weekly Petty Cash - Front Desk Support", category: "Petty Cash", amount: 30000, status: "Disbursed", requestedBy: "Victoria Aghogho Otojareri", createdAt: "2026-07-14T09:00:00Z" }
		]);

		// Mock invoices
		setInvoices([
			{ id: "inv-1", invoiceNumber: "INV-2026-001", customerName: "Dangote Group Plc", customerEmail: "billing@dangote.com", amount: 1850000, dueDate: "2026-07-25", status: "Unpaid", createdAt: "2026-07-10T11:00:00Z" },
			{ id: "inv-2", invoiceNumber: "INV-2026-002", customerName: "Jumia Nigeria", customerEmail: "finance@jumia.com.ng", amount: 920000, dueDate: "2026-07-15", status: "Paid", createdAt: "2026-07-01T09:00:00Z" },
			{ id: "inv-3", invoiceNumber: "INV-2026-003", customerName: "Interswitch Group", customerEmail: "vendor-mgmt@interswitch.com", amount: 2400000, dueDate: "2026-08-05", status: "Unpaid", createdAt: "2026-07-12T15:30:00Z" },
			{ id: "inv-4", invoiceNumber: "INV-2026-004", customerName: "Andela Devs Ltd", customerEmail: "ops-payments@andela.com", amount: 680000, dueDate: "2026-07-01", status: "Overdue", createdAt: "2026-06-25T10:00:00Z" }
		]);

		// Mock reconciliations
		setReconciliations([
			{ id: "rec-1", title: "Weekly Shuttle Services Reconciliation (W27)", type: "Shuttle", periodStart: "2026-07-01", periodEnd: "2026-07-07", expectedAmount: 1250000, actualAmount: 1250000, discrepancy: 0, status: "Resolved", preparedBy: "Victoria Aghogho Otojareri", createdAt: "2026-07-08T16:00:00Z" },
			{ id: "rec-2", title: "KHLC Training Bus Fuel & Operations", type: "KHLC", periodStart: "2026-07-01", periodEnd: "2026-07-07", expectedAmount: 320000, actualAmount: 315000, discrepancy: -5000, status: "Resolved", preparedBy: "Victoria Aghogho Otojareri", createdAt: "2026-07-08T16:30:00Z" },
			{ id: "rec-3", title: "Rental Bus Operations - Airport Runs", type: "Rental Bus", periodStart: "2026-07-08", periodEnd: "2026-07-14", expectedAmount: 850000, actualAmount: 800000, discrepancy: -50000, status: "Flagged", preparedBy: "Victoria Aghogho Otojareri", createdAt: "2026-07-15T12:00:00Z" }
		]);

		// Mock transactions
		setTransactions([
			{ id: "txn-1", type: "Credit", category: "Revenue - Fleet Rental", amount: 920000, date: "2026-07-14", description: "Payment received from Jumia Nigeria for invoice INV-2026-002", createdAt: "2026-07-14T09:30:00Z" },
			{ id: "txn-2", type: "Debit", category: "Expense - Fleet Operations", amount: 450000, date: "2026-07-05", description: "Fuel Imprest disbursement for Lagos fleet operations", createdAt: "2026-07-05T11:00:00Z" },
			{ id: "txn-3", type: "Debit", category: "Expense - Petty Cash", amount: 30000, date: "2026-07-02", description: "Disbursement of weekly petty cash to admin desk", createdAt: "2026-07-02T10:00:00Z" },
			{ id: "txn-4", type: "Credit", category: "Revenue - Bus Ticket Sales", amount: 1500000, date: "2026-07-10", description: "Weekly cash and card ticket sales from terminals", createdAt: "2026-07-10T17:00:00Z" }
		]);
	};

	useEffect(() => {
		const stored = localStorage.getItem("erp_current_user");
		if (stored) {
			setCurrentUser(JSON.parse(stored));
		}
		fetchFinanceData();
	}, []);

	// Actions
	const handleCreateInvoice = async (e: React.FormEvent) => {
		e.preventDefault();
		const amountNum = parseFloat(newInvoice.amount);
		if (isNaN(amountNum) || amountNum <= 0) {
			alert("Please enter a valid amount");
			return;
		}

		try {
			const res = await fetch(`${FINANCE_API_URL}/invoices`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					customerName: newInvoice.customerName,
					customerEmail: newInvoice.customerEmail,
					amount: amountNum,
					dueDate: newInvoice.dueDate,
					description: newInvoice.description || undefined
				})
			});
			if (res.ok) {
				setShowInvoiceModal(false);
				setNewInvoice({ customerName: "", customerEmail: "", amount: "", dueDate: "", description: "" });
				fetchFinanceData();
			} else {
				alert("Failed to submit invoice to microservice.");
			}
		} catch (err) {
			alert("Error connecting to server. Creating locally instead.");
			// Fallback local update
			const mockInv: Invoice = {
				id: `inv-${Date.now()}`,
				invoiceNumber: `INV-2026-${Math.floor(Math.random() * 1000)}`,
				customerName: newInvoice.customerName,
				customerEmail: newInvoice.customerEmail,
				amount: amountNum,
				dueDate: newInvoice.dueDate,
				status: "Unpaid",
				description: newInvoice.description || undefined,
				createdAt: new Date().toISOString()
			};
			setInvoices(prev => [mockInv, ...prev]);
			setStats(prev => ({
				...prev,
				outstandingInvoice: prev.outstandingInvoice + amountNum
			}));
			setShowInvoiceModal(false);
			setNewInvoice({ customerName: "", customerEmail: "", amount: "", dueDate: "", description: "" });
		}
	};

	const handleRequestExpense = async (e: React.FormEvent) => {
		e.preventDefault();
		const amountNum = parseFloat(newExpense.amount);
		if (isNaN(amountNum) || amountNum <= 0) {
			alert("Please enter a valid amount");
			return;
		}

		const requestedBy = currentUser?.name || "Victoria Aghogho Otojareri";

		try {
			const res = await fetch(`${FINANCE_API_URL}/expenses`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: newExpense.title,
					category: newExpense.category,
					amount: amountNum,
					requestedBy: requestedBy,
					description: newExpense.description || undefined
				})
			});
			if (res.ok) {
				setShowExpenseModal(false);
				setNewExpense({ title: "", category: "Fleet Operations", amount: "", description: "" });
				fetchFinanceData();
			} else {
				alert("Failed to submit expense request.");
			}
		} catch (err) {
			alert("Error connecting to server. Submitting locally.");
			const mockExp: Expense = {
				id: `exp-${Date.now()}`,
				title: newExpense.title,
				category: newExpense.category,
				amount: amountNum,
				status: "Pending",
				requestedBy: requestedBy,
				description: newExpense.description || undefined,
				createdAt: new Date().toISOString()
			};
			setExpenses(prev => [mockExp, ...prev]);
			setStats(prev => ({
				...prev,
				pendingPayables: prev.pendingPayables + amountNum
			}));
			setShowExpenseModal(false);
			setNewExpense({ title: "", category: "Fleet Operations", amount: "", description: "" });
		}
	};

	const handleCreateReconciliation = async (e: React.FormEvent) => {
		e.preventDefault();
		const expectedNum = parseFloat(newReconcile.expectedAmount);
		const actualNum = parseFloat(newReconcile.actualAmount);
		if (isNaN(expectedNum) || isNaN(actualNum)) {
			alert("Please enter valid expected and actual amounts");
			return;
		}

		const preparedBy = currentUser?.name || "Victoria Aghogho Otojareri";
		const discrepancy = actualNum - expectedNum;

		try {
			const res = await fetch(`${FINANCE_API_URL}/reconciliations`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: newReconcile.title,
					type: newReconcile.type,
					periodStart: newReconcile.periodStart,
					periodEnd: newReconcile.periodEnd,
					expectedAmount: expectedNum,
					actualAmount: actualNum,
					preparedBy: preparedBy,
					notes: newReconcile.notes || undefined
				})
			});
			if (res.ok) {
				setShowReconcileModal(false);
				setNewReconcile({ title: "", type: "Shuttle", periodStart: "", periodEnd: "", expectedAmount: "", actualAmount: "", notes: "" });
				fetchFinanceData();
			} else {
				alert("Failed to save reconciliation log.");
			}
		} catch (err) {
			alert("Error connecting to server. Saving locally.");
			const mockRec: Reconciliation = {
				id: `rec-${Date.now()}`,
				title: newReconcile.title,
				type: newReconcile.type,
				periodStart: newReconcile.periodStart,
				periodEnd: newReconcile.periodEnd,
				expectedAmount: expectedNum,
				actualAmount: actualNum,
				discrepancy: discrepancy,
				status: discrepancy === 0 ? "Resolved" : "Flagged",
				preparedBy: preparedBy,
				notes: newReconcile.notes || undefined,
				createdAt: new Date().toISOString()
			};
			setReconciliations(prev => [mockRec, ...prev]);
			setShowReconcileModal(false);
			setNewReconcile({ title: "", type: "Shuttle", periodStart: "", periodEnd: "", expectedAmount: "", actualAmount: "", notes: "" });
		}
	};

	const handleUpdateInvoiceStatus = async (id: string, status: string) => {
		try {
			const res = await fetch(`${FINANCE_API_URL}/invoices`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, status })
			});
			if (res.ok) {
				fetchFinanceData();
			} else {
				alert("Failed to update status.");
			}
		} catch (err) {
			// Local update
			const inv = invoices.find(i => i.id === id);
			if (!inv) return;
			const oldStatus = inv.status;
			inv.status = status;
			setInvoices([...invoices]);

			if (oldStatus !== "Paid" && status === "Paid") {
				// Record cash revenue transaction
				const mockTxn: Transaction = {
					id: `txn-${Date.now()}`,
					referenceId: id,
					type: "Credit",
					category: "Revenue - Invoice Settlement",
					amount: inv.amount,
					date: new Date().toISOString().slice(0, 10),
					description: `Settlement received for invoice ${inv.invoiceNumber}`,
					createdAt: new Date().toISOString()
				};
				setTransactions(prev => [mockTxn, ...prev]);
				setStats(prev => ({
					...prev,
					totalRevenue: prev.totalRevenue + inv.amount,
					outstandingInvoice: Math.max(0, prev.outstandingInvoice - inv.amount)
				}));
			}
		}
	};

	const handleUpdateExpenseStatus = async (id: string, status: string) => {
		const approvedBy = currentUser?.name || "System Administrator";
		try {
			const res = await fetch(`${FINANCE_API_URL}/expenses`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, status, approvedBy })
			});
			if (res.ok) {
				fetchFinanceData();
			} else {
				alert("Failed to update expense status.");
			}
		} catch (err) {
			const exp = expenses.find(e => e.id === id);
			if (!exp) return;
			const oldStatus = exp.status;
			exp.status = status;
			exp.approvedBy = approvedBy;
			setExpenses([...expenses]);

			if (oldStatus !== "Disbursed" && status === "Disbursed") {
				// Log debit transaction
				const mockTxn: Transaction = {
					id: `txn-${Date.now()}`,
					referenceId: id,
					type: "Debit",
					category: exp.category,
					amount: exp.amount,
					date: new Date().toISOString().slice(0, 10),
					description: `Imprest disbursed for expense: ${exp.title}`,
					createdAt: new Date().toISOString()
				};
				setTransactions(prev => [mockTxn, ...prev]);
				setStats(prev => ({
					...prev,
					totalExpenses: prev.totalExpenses + exp.amount,
					pendingPayables: Math.max(0, prev.pendingPayables - exp.amount)
				}));
			} else if (oldStatus === "Pending" && status === "Approved") {
				setStats(prev => ({
					...prev,
					pendingPayables: Math.max(0, prev.pendingPayables - exp.amount)
				}));
			}
		}
	};

	const handleResolveReconciliation = async (id: string) => {
		try {
			const res = await fetch(`${FINANCE_API_URL}/reconciliations`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, status: "Resolved" })
			});
			if (res.ok) {
				fetchFinanceData();
			}
		} catch (err) {
			const rec = reconciliations.find(r => r.id === id);
			if (rec) {
				rec.status = "Resolved";
				setReconciliations([...reconciliations]);
			}
		}
	};

	// Format currency (Naira)
	const formatNaira = (amount: number) => {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			minimumFractionDigits: 2
		}).format(amount);
	};

	const formatNairaShort = (val: number) => {
		const isNegative = val < 0;
		const absVal = Math.abs(val);
		let formatted = "";
		if (absVal >= 1000000) {
			formatted = `₦${(absVal / 1000000).toFixed(2)}M`;
		} else if (absVal >= 1000) {
			formatted = `₦${(absVal / 1000).toFixed(1)}k`;
		} else {
			formatted = `₦${absVal.toFixed(2)}`;
		}
		return isNegative ? `-${formatted}` : formatted;
	};

	// Computed figures for the overview page
	const totalAssets = stats.totalRevenue - stats.totalExpenses + 12000000; // Mock base assets + net revenue
	const totalLiabilities = stats.pendingPayables + 50000; // Mock accounts payable + minor base
	const equity = totalAssets - totalLiabilities;
	const netPosition = stats.totalRevenue - stats.totalExpenses;

	// Chart of accounts mock array based on the screenshot
	const chartOfAccounts = accountsList.map(a => {
		let val = 0;
		if (a.useOutstandingInvoice) {
			val = stats.outstandingInvoice;
		} else if (a.usePendingPayables) {
			val = stats.pendingPayables;
		} else if (a.useEquity) {
			val = equity;
		} else if (a.revenueRatio !== undefined) {
			val = stats.totalRevenue * a.revenueRatio;
		} else if (a.expenseRatio !== undefined) {
			val = stats.totalExpenses * a.expenseRatio;
		} else if (a.code === "1000") {
			val = totalAssets - 4000000;
		} else {
			val = a.baseVal || 0;
		}

		return {
			code: a.code,
			name: a.name,
			type: a.type,
			debit: a.isDebit ? val : 0,
			credit: !a.isDebit ? val : 0,
			status: "Active"
		};
	});

	if (!currentUser) return null;

	return (
		<ERPLayout>
			<div className="flex flex-col gap-6">
				
				{/* Top Command Banner - Title & Subtitle block */}
				<div>
					<h2 className="text-[20px] font-black text-slate-800 tracking-tight">Finance Hub Overview</h2>
					<p className="text-xs text-slate-450 font-semibold mt-1">
						Manage corporate accounts, invoice approvals, cashbook reconciliations, and imprest distributions.
					</p>

					{/* Action Buttons Row */}
					<div className="flex items-center gap-2 flex-wrap mt-3">
						<button
							onClick={() => setShowInvoiceModal(true)}
							className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer border-none"
						>
							Create Invoice
						</button>
						<button
							onClick={() => setShowExpenseModal(true)}
							className="px-4 py-2 bg-white border border-gray-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs transition-all cursor-pointer"
						>
							Request Imprest
						</button>
						<button
							onClick={() => setShowReconcileModal(true)}
							className="px-4 py-2 bg-white border border-gray-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs transition-all cursor-pointer"
						>
							New Reconciliation
						</button>
					</div>
				</div>

				{/* Error Notice banner */}
				{error && (
					<div className="bg-amber-50 border border-amber-100 text-amber-800 rounded-xl p-4 text-xs font-semibold">
						{error}
					</div>
				)}

				{/* Nav Tabs */}
				<div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide gap-1">
					{[
						{ id: "overview", label: "Finance Hub" },
						{ id: "coa", label: "Chart of Accounts" },
						{ id: "invoices", label: "Invoices (Aged Receivables)" },
						{ id: "expenses", label: "Imprest & Expenses (Payables)" },
						{ id: "reconcile", label: "Bank Reconciliation" },
						{ id: "ledger", label: "General Journal Ledger" }
					].map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`px-5 py-3 font-extrabold text-xs whitespace-nowrap border-b-2 transition-all cursor-pointer ${
								activeTab === tab.id
									? "border-blue-600 text-blue-600"
									: "border-transparent text-slate-400 hover:text-slate-700"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>

				{loading ? (
					<div className="py-20 flex justify-center items-center">
						<div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
					</div>
				) : (
					<div className="flex flex-col gap-6">
						
						{/* VIEW 1: OVERVIEW */}
						{activeTab === "overview" && (
							<div className="flex flex-col gap-6 animate-fadeIn">
									{/* Balance Sheet KPI cards */}
								<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
									{[
										{ label: "Assets", val: totalAssets, neg: totalAssets < 0, theme: "from-blue-50/50 to-indigo-50/20 border-blue-100 text-blue-900 shadow-blue-50/20" },
										{ label: "Liabilities", val: totalLiabilities, neg: false, theme: "from-rose-50/50 to-red-50/20 border-rose-100 text-red-900 shadow-rose-50/20" },
										{ label: "Equity", val: equity, neg: equity < 0, theme: "from-purple-50/50 to-fuchsia-50/20 border-purple-100 text-purple-900 shadow-purple-50/20" },
										{ label: "Income", val: stats.totalRevenue, neg: false, theme: "from-emerald-50/50 to-teal-50/20 border-emerald-100 text-emerald-900 shadow-emerald-50/20" },
										{ label: "Expenses", val: stats.totalExpenses, neg: false, theme: "from-orange-50/50 to-amber-50/20 border-orange-100 text-orange-900 shadow-orange-50/20" },
										{ label: "Net Position", val: netPosition, neg: netPosition < 0, theme: "from-slate-50 to-slate-100 border-slate-200 text-slate-900 shadow-slate-50/20" }
									].map((card, idx) => (
										<div key={idx} className={`bg-gradient-to-br ${card.theme} rounded-2xl p-4 shadow-sm border flex flex-col justify-between min-h-24 hover:scale-[1.02] hover:shadow-md transition-all duration-300`}>
											<span className="text-[9px] font-black uppercase tracking-wider opacity-60">{card.label}</span>
											<h3 className={`text-sm font-black mt-2 ${card.neg ? "text-red-700" : ""}`}>
												{formatNairaShort(card.val)}
											</h3>
										</div>
									))}
								</div>										{/* Grid: Financial Health & Shortcut links */}
								<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
									
									{/* Financial Health Indicators (8cols) */}
									<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 lg:col-span-8 flex flex-col gap-5">
										<div className="flex justify-between items-center pb-3 border-b border-gray-100">
											<div>
												<h3 className="font-extrabold text-slate-800 text-sm">Financial Health Indicators</h3>
												<p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Risk signals and cash efficiency metrics</p>
											</div>
											<span className="text-[10px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded font-extrabold uppercase tracking-wide border border-blue-100">CFO Signals</span>
										</div>

										<div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
											{[
												{ label: "Cash Runway", val: "-2.7 Months", desc: "Based on approved monthly expenses.", status: "border-red-500 bg-red-50/20" },
												{ label: "Collection Risk", val: "0.0%", desc: "Overdue from open corporate receivables.", status: "border-slate-300 bg-slate-50/20" },
												{ label: "Expense Spike", val: "-62.0%", desc: "Current month vs previous month.", status: "border-emerald-500 bg-emerald-50/20" },
												{ label: "Profit Trend", val: "+62.0%", desc: "Net operational profit monthly delta.", status: "border-emerald-500 bg-emerald-50/20" },
												{ label: "Tax Exposure", val: formatNaira(3.75), desc: "Taxes currently sitting in payable account.", status: "border-blue-500 bg-blue-50/20" },
												{ label: "Payables Due Soon", val: formatNaira(stats.pendingPayables), desc: "Vendor obligations due in the next 7 days.", status: "border-rose-500 bg-rose-50/20" }
											].map((h, i) => (
												<div key={i} className={`flex flex-col gap-1.5 p-3.5 border-l-4 ${h.status} rounded-r-2xl hover:bg-white hover:shadow-md transition-all duration-200`}>
													<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{h.label}</span>
													<span className="text-xs font-black text-slate-800">{h.val}</span>
													<p className="text-[9px] text-slate-400 leading-relaxed mt-1 font-semibold">{h.desc}</p>
												</div>
											))}
										</div>
									</div>

									{/* Quick Workspace menu (4cols) */}
									<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 lg:col-span-4 flex flex-col gap-4">
										<div>
											<h3 className="font-extrabold text-slate-800 text-sm">Finance Workspace</h3>
											<p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Shortcuts to ledger modules</p>
										</div>
										<div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
											{[
												{ title: "Chart of Accounts", desc: "Account structure and classifications.", icon: <IconClipboardList className="w-5 h-5 text-blue-600" />, action: () => {} },
												{ title: "Aged Receivables", desc: "Who owes us and how old it is.", icon: <IconCalendarClock className="w-5 h-5 text-emerald-600" />, action: () => setActiveTab("invoices") },
												{ title: "Aged Payables", desc: "What we owe vendors and when.", icon: <IconReceipt className="w-5 h-5 text-red-500" />, action: () => setActiveTab("expenses") },
												{ title: "Bank Reconciliation", desc: "Match statements with transaction logs.", icon: <IconReportMoney className="w-5 h-5 text-purple-600" />, action: () => setActiveTab("reconcile") }
											].map((wItem, index) => (
												<button
													key={index}
													onClick={wItem.action}
													className="group flex items-center justify-between p-3 hover:bg-slate-50 transition-all rounded-xl text-left border border-gray-100/50 hover:border-blue-200/50 hover:shadow-sm hover:scale-[1.01]"
												>
													<div className="flex items-center gap-3.5">
														<div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all">{wItem.icon}</div>
														<div>
															<h4 className="text-xs font-bold text-slate-800">{wItem.title}</h4>
															<p className="text-[10px] text-slate-400 font-semibold">{wItem.desc}</p>
														</div>
													</div>
													<IconChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
												</button>
											))}
										</div>
									</div>

								</div>

								{/* Chart of Accounts Grid */}
								<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-5">
									<div className="flex justify-between items-center pb-3 border-b border-gray-100">
										<div>
											<h3 className="font-extrabold text-slate-800 text-sm">Chart of Accounts</h3>
											<p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Ledger structure and account balances</p>
										</div>
										<span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">{chartOfAccounts.length} Accounts Loaded</span>
									</div>

									<div className="overflow-x-auto">
										<table className="w-full text-left border-collapse">
											<thead>
												<tr className="border-b border-gray-100">
													<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Code</th>
													<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Account Name</th>
													<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Type</th>
													<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider text-right">Debit</th>
													<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider text-right">Credit</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-gray-100">
												{chartOfAccounts.map((acct, idx) => (
													<tr key={idx} className="hover:bg-slate-50/50 transition-colors">
														<td className="py-3 text-xs font-mono font-bold text-slate-500">{acct.code}</td>
														<td className="py-3 text-xs font-bold text-slate-800">{acct.name}</td>
														<td className="py-3 text-[10px] font-semibold">
															<span className={`px-2 py-0.5 rounded-full ${
																acct.type === "Assets" ? "bg-blue-50 text-blue-700" :
																acct.type === "Liabilities" ? "bg-amber-50 text-amber-700" :
																acct.type === "Equity" ? "bg-purple-50 text-purple-700" :
																acct.type === "Income" ? "bg-emerald-50 text-emerald-700" :
																"bg-red-50 text-red-700"
															}`}>
																{acct.type}
															</span>
														</td>
														<td className="py-3 text-xs font-semibold text-slate-700 text-right">
															{acct.debit > 0 ? formatNaira(acct.debit) : "—"}
														</td>
														<td className="py-3 text-xs font-semibold text-slate-700 text-right">
															{acct.credit > 0 ? formatNaira(acct.credit) : "—"}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>

								{/* Recent Journal Transactions */}
								<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-5">
									<div className="flex justify-between items-center pb-3 border-b border-gray-100">
										<div>
											<h3 className="font-extrabold text-slate-800 text-sm">Recent Ledger Journal Entries</h3>
											<p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Real-time credit and debit updates</p>
										</div>
										<button
											onClick={() => setActiveTab("ledger")}
											className="text-xs text-blue-600 hover:text-blue-700 font-bold bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 transition-colors"
										>
											View All Logs
										</button>
									</div>

									<div className="overflow-x-auto">
										<table className="w-full text-left border-collapse">
											<thead>
												<tr className="border-b border-gray-100">
													<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Journal #</th>
													<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Date</th>
													<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Description</th>
													<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider text-right">Debit</th>
													<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider text-right">Credit</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-gray-100">
												{transactions.slice(0, 5).map((txn, index) => (
													<tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
														<td className="py-3.5 text-xs font-mono font-bold text-slate-500">JRN-00{568 - index}</td>
														<td className="py-3.5 text-xs font-semibold text-slate-500">
															{new Date(txn.date).toLocaleDateString()}
														</td>
														<td className="py-3.5 text-xs font-bold text-slate-800">{txn.description}</td>
														<td className="py-3.5 text-xs font-semibold text-slate-700 text-right">
															{txn.type === "Debit" ? formatNaira(txn.amount) : "—"}
														</td>
														<td className="py-3.5 text-xs font-semibold text-slate-700 text-right">
															{txn.type === "Credit" ? formatNaira(txn.amount) : "—"}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>

							</div>
						)}

						{/* VIEW 2: INVOICES (AGED RECEIVABLES) */}
						{activeTab === "invoices" && (
							<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 animate-fadeIn">
								<div className="flex justify-between items-center pb-3 border-b border-gray-100 flex-wrap gap-2">
									<div>
										<h3 className="font-bold text-slate-800 text-sm">Customer Invoices (Aged Receivables)</h3>
										<p className="text-[10px] text-slate-400 font-semibold">Total Outstanding: {formatNaira(stats.outstandingInvoice)}</p>
									</div>
									<button
										onClick={() => setShowInvoiceModal(true)}
										className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
									>
										Create New Invoice
									</button>
								</div>

								<div className="overflow-x-auto">
									<table className="w-full text-left border-collapse">
										<thead>
											<tr className="border-b border-gray-100">
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Invoice #</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Customer</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Amount</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Due Date</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Status</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider text-right">Actions</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-100">
											{invoices.map((inv) => (
												<tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
													<td className="py-4 text-xs font-mono font-bold text-slate-500">{inv.invoiceNumber}</td>
													<td className="py-4">
														<p className="font-bold text-slate-800 text-xs">{inv.customerName}</p>
														<p className="text-[10px] text-slate-400 font-semibold">{inv.customerEmail}</p>
													</td>
													<td className="py-4 text-xs font-black text-slate-700">{formatNaira(inv.amount)}</td>
													<td className="py-4 text-xs font-semibold text-slate-500">{inv.dueDate}</td>
													<td className="py-4">
														<span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
															inv.status === "Paid" ? "bg-emerald-100 text-emerald-700" :
															inv.status === "Overdue" ? "bg-red-100 text-red-700" :
															"bg-amber-100 text-amber-700"
														}`}>
															{inv.status}
														</span>
													</td>
													<td className="py-4 text-right">
														{inv.status !== "Paid" ? (
															<button
																onClick={() => handleUpdateInvoiceStatus(inv.id, "Paid")}
																className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] cursor-pointer"
															>
																Record Payment
															</button>
														) : (
															<span className="text-[10px] text-slate-400 font-bold">Settled</span>
														)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}

						{/* VIEW 3: EXPENSES (PAYABLES) */}
						{activeTab === "expenses" && (
							<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 animate-fadeIn">
								<div className="flex justify-between items-center pb-3 border-b border-gray-100 flex-wrap gap-2">
									<div>
										<h3 className="font-bold text-slate-800 text-sm">Imprests & Expenses (Payables)</h3>
										<p className="text-[10px] text-slate-400 font-semibold">Awaiting Settlement: {formatNaira(stats.pendingPayables)}</p>
									</div>
									<button
										onClick={() => setShowExpenseModal(true)}
										className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
									>
										Request Imprest
									</button>
								</div>

								<div className="overflow-x-auto">
									<table className="w-full text-left border-collapse">
										<thead>
											<tr className="border-b border-gray-100">
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Expense Item</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Category</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Amount</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Requested By</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Status</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider text-right">Actions</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-100">
											{expenses.map((exp) => (
												<tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
													<td className="py-4">
														<p className="font-bold text-slate-800 text-xs">{exp.title}</p>
														<p className="text-[10px] text-slate-400 font-semibold">{exp.description || "No description provided"}</p>
													</td>
													<td className="py-4 text-xs font-semibold text-slate-500">{exp.category}</td>
													<td className="py-4 text-xs font-black text-slate-700">{formatNaira(exp.amount)}</td>
													<td className="py-4 text-xs font-semibold text-slate-500">{exp.requestedBy}</td>
													<td className="py-4">
														<span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
															exp.status === "Disbursed" ? "bg-emerald-100 text-emerald-700" :
															exp.status === "Approved" ? "bg-blue-100 text-blue-700" :
															exp.status === "Rejected" ? "bg-red-100 text-red-700" :
															"bg-amber-100 text-amber-700"
														}`}>
															{exp.status}
														</span>
													</td>
													<td className="py-4 text-right flex gap-1 justify-end">
														{exp.status === "Pending" && (
															<>
																<button
																	onClick={() => handleUpdateExpenseStatus(exp.id, "Approved")}
																	className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[9px] cursor-pointer"
																>
																	Approve
																</button>
																<button
																	onClick={() => handleUpdateExpenseStatus(exp.id, "Rejected")}
																	className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-[9px] cursor-pointer"
																>
																	Reject
																</button>
															</>
														)}
														{exp.status === "Approved" && (
															<button
																onClick={() => handleUpdateExpenseStatus(exp.id, "Disbursed")}
																className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] cursor-pointer"
															>
																Disburse Cash
															</button>
														)}
														{exp.status === "Disbursed" && (
															<span className="text-[10px] text-slate-455 font-bold">Paid</span>
														)}
														{exp.status === "Rejected" && (
															<span className="text-[10px] text-red-500 font-bold">Declined</span>
														)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}

						{/* VIEW 4: BANK RECONCILIATION */}
						{activeTab === "reconcile" && (
							<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 animate-fadeIn">
								<div className="flex justify-between items-center pb-3 border-b border-gray-100 flex-wrap gap-2">
									<div>
										<h3 className="font-bold text-slate-800 text-sm">Bank Reconciliation Ledger</h3>
										<p className="text-[10px] text-slate-400 font-semibold">Match transaction values with bank statement records.</p>
									</div>
									<button
										onClick={() => setShowReconcileModal(true)}
										className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
									>
										New Reconciliation Run
									</button>
								</div>

								<div className="overflow-x-auto">
									<table className="w-full text-left border-collapse">
										<thead>
											<tr className="border-b border-gray-100">
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Reconciled Item</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Expected (System)</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Actual (Bank)</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Discrepancy</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Status</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider text-right">Actions</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-100">
											{reconciliations.map((rec) => (
												<tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
													<td className="py-4">
														<p className="font-bold text-slate-800 text-xs">{rec.title}</p>
														<p className="text-[10px] text-slate-400 font-semibold">Period: {rec.periodStart} to {rec.periodEnd} • Prepared by {rec.preparedBy}</p>
														{rec.notes && <p className="text-[10px] text-amber-700 italic mt-0.5">Notes: {rec.notes}</p>}
													</td>
													<td className="py-4 text-xs font-bold text-slate-600">{formatNaira(rec.expectedAmount)}</td>
													<td className="py-4 text-xs font-bold text-slate-600">{formatNaira(rec.actualAmount)}</td>
													<td className={`py-4 text-xs font-black ${rec.discrepancy === 0 ? "text-emerald-600" : "text-red-650"}`}>
														{formatNaira(rec.discrepancy)}
													</td>
													<td className="py-4">
														<span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
															rec.status === "Resolved" ? "bg-emerald-100 text-emerald-700" :
															"bg-red-100 text-red-700 animate-pulse"
														}`}>
															{rec.status}
														</span>
													</td>
													<td className="py-4 text-right">
														{rec.status !== "Resolved" ? (
															<button
																onClick={() => handleResolveReconciliation(rec.id)}
																className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] cursor-pointer"
															>
																Mark Resolved
															</button>
														) : (
															<span className="text-[10px] text-slate-400 font-bold">Resolved</span>
														)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}

						{/* VIEW 6: CHART OF ACCOUNTS MANAGER */}
						{activeTab === "coa" && (
							<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6 animate-fadeIn">
								
								{/* COA Header & Top Action row */}
								<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
									<div>
										<h3 className="font-extrabold text-slate-800 text-sm">Chart of Accounts (COA)</h3>
										<p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Organize and manage your general ledger accounts</p>
									</div>
									<button
										onClick={() => setShowAddAccountModal(true)}
										className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm shadow-blue-500/10 active:scale-95 transition-all"
									>
										+ Add Account
									</button>
								</div>

								{/* Search & Category Filter toolbar */}
								<div className="flex flex-col md:flex-row justify-between gap-4">
									{/* Search input */}
									<div className="relative w-full md:w-80">
										<input
											type="text"
											placeholder="Search code or name..."
											value={coaSearchQuery}
											onChange={(e) => setCoaSearchQuery(e.target.value)}
											className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold outline-none"
										/>
										<div className="absolute left-3 top-2.5 text-slate-400">
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
											</svg>
										</div>
									</div>

									{/* Category quick tabs */}
									<div className="flex flex-wrap gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100/50">
										{["All", "Assets", "Liabilities", "Equity", "Income", "Expenses"].map((cat) => (
											<button
												key={cat}
												onClick={() => setCoaFilterType(cat)}
												className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
													coaFilterType === cat
														? "bg-white text-blue-600 shadow-sm border border-slate-100"
														: "text-slate-450 hover:text-slate-700"
												}`}
											>
												{cat}
											</button>
										))}
									</div>
								</div>

								{/* Accounts Listing table */}
								<div className="overflow-x-auto">
									<table className="w-full text-left border-collapse">
										<thead>
											<tr className="border-b border-gray-100">
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Account Code</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Account Name</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Type</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Status</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider text-right">Debit Balance</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider text-right">Credit Balance</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider text-right">Actions</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-100">
											{chartOfAccounts
												.filter(a => {
													const matchesSearch = a.code.toLowerCase().includes(coaSearchQuery.toLowerCase()) ||
														a.name.toLowerCase().includes(coaSearchQuery.toLowerCase());
													const matchesCat = coaFilterType === "All" || a.type === coaFilterType;
													return matchesSearch && matchesCat;
												})
												.map((acct, idx) => (
													<tr key={idx} className="hover:bg-slate-50/50 transition-colors">
														<td className="py-3.5 text-xs font-mono font-bold text-slate-500">
															<span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] border border-slate-200">
																{acct.code}
															</span>
														</td>
														<td className="py-3.5 text-xs font-black text-slate-800">{acct.name}</td>
														<td className="py-3.5 text-[10px] font-semibold">
															<span className={`px-2 py-0.5 rounded-full ${
																acct.type === "Assets" ? "bg-blue-50 text-blue-700 border border-blue-100" :
																acct.type === "Liabilities" ? "bg-amber-50 text-amber-700 border border-amber-100" :
																acct.type === "Equity" ? "bg-purple-50 text-purple-700 border border-purple-100" :
																acct.type === "Income" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
																"bg-red-50 text-red-700 border border-red-100"
															}`}>
																{acct.type}
															</span>
														</td>
														<td className="py-3.5 text-[10px]">
															<span className="flex items-center gap-1.5 text-emerald-700 font-bold">
																<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
																Active
															</span>
														</td>
														<td className="py-3.5 text-xs font-semibold text-slate-700 text-right">
															{acct.debit > 0 ? formatNaira(acct.debit) : "—"}
														</td>
														<td className="py-3.5 text-xs font-semibold text-slate-700 text-right">
															{acct.credit > 0 ? formatNaira(acct.credit) : "—"}
														</td>
														<td className="py-3.5 text-right">
															<button
																onClick={() => {
																	setLedgerSearchQuery(acct.name);
																	setActiveTab("ledger");
																}}
																className="text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 px-2 py-1 rounded-lg transition-colors font-bold cursor-pointer"
															>
																Ledger logs
															</button>
														</td>
													</tr>
												))}
										</tbody>
									</table>
								</div>
							</div>
						)}

						{/* VIEW 5: GENERAL JOURNAL LEDGER */}
						{activeTab === "ledger" && (
							<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 animate-fadeIn">
								<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-gray-100">
									<div>
										<h3 className="font-bold text-slate-800 text-sm">General Journal Cashbook Ledger</h3>
										<p className="text-[10px] text-slate-400 font-semibold">Historically recorded operational transactions</p>
									</div>
									{/* Search Ledger */}
									<div className="relative w-full sm:w-64">
										<input
											type="text"
											placeholder="Search description/category..."
											value={ledgerSearchQuery}
											onChange={(e) => setLedgerSearchQuery(e.target.value)}
											className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold outline-none"
										/>
										<div className="absolute left-3 top-2.5 text-slate-400">
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
											</svg>
										</div>
									</div>
								</div>

								<div className="overflow-x-auto">
									<table className="w-full text-left border-collapse">
										<thead>
											<tr className="border-b border-gray-100">
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Date</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Category</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Description</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider">Type</th>
												<th className="pb-3 text-xs font-bold text-slate-455 uppercase tracking-wider text-right">Amount</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-100">
											{transactions
												.filter(txn => {
													if (!ledgerSearchQuery) return true;
													const q = ledgerSearchQuery.toLowerCase();
													return txn.category.toLowerCase().includes(q) ||
														(txn.description && txn.description.toLowerCase().includes(q));
												})
												.map((txn) => (
												<tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
													<td className="py-4 text-xs font-semibold text-slate-500">
														{new Date(txn.date).toLocaleDateString()}
													</td>
													<td className="py-4 text-xs font-bold text-slate-800">{txn.category}</td>
													<td className="py-4 text-xs font-semibold text-slate-500">{txn.description}</td>
													<td className="py-4">
														<span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
															txn.type === "Credit" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
														}`}>
															{txn.type === "Credit" ? "Credit (Rev)" : "Debit (Exp)"}
														</span>
													</td>
													<td className="py-4 text-xs font-black text-slate-700 text-right">{formatNaira(txn.amount)}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}

					</div>
				)}

			</div>

			{/* MODAL 5: ADD ACCOUNT FORM */}
			{showAddAccountModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
					<div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-slideUp">
						{/* Header */}
						<div className="flex justify-between items-center p-6 border-b border-gray-100 bg-slate-50/50">
							<div>
								<h3 className="font-extrabold text-slate-800 text-sm">Add New Ledger Account</h3>
								<p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Integrate a new code into the Chart of Accounts</p>
							</div>
							<button
								onClick={() => setShowAddAccountModal(false)}
								className="w-7 h-7 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-sm font-bold border-none bg-transparent"
							>
								✕
							</button>
						</div>

						{/* Form Body */}
						<form
							onSubmit={(e) => {
								e.preventDefault();
								if (!newAccount.code || !newAccount.name) {
									alert("Please fill in Code and Name fields.");
									return;
								}
								const baseNum = parseFloat(newAccount.baseVal) || 0;
								setAccountsList(prev => [
									...prev,
									{
										code: newAccount.code,
										name: newAccount.name,
										type: newAccount.type,
										isDebit: newAccount.isDebit === "true",
										baseVal: baseNum
									}
								]);
								setShowAddAccountModal(false);
								setNewAccount({ code: "", name: "", type: "Assets", isDebit: "true", baseVal: "" });
							}}
							className="p-6 flex flex-col gap-4 text-left"
						>
							{/* Account Code */}
							<div className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-450 uppercase">Account Code</label>
								<input
									type="text"
									placeholder="e.g. 1005"
									required
									value={newAccount.code}
									onChange={(e) => setNewAccount(prev => ({ ...prev, code: e.target.value }))}
									className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
								/>
							</div>

							{/* Account Name */}
							<div className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-450 uppercase">Account Name</label>
								<input
									type="text"
									placeholder="e.g. Apex Bank Account"
									required
									value={newAccount.name}
									onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
									className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
								/>
							</div>

							{/* Account Type */}
							<div className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-450 uppercase">Account Type</label>
								<select
									value={newAccount.type}
									onChange={(e) => setNewAccount(prev => ({ ...prev, type: e.target.value }))}
									className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
								>
									<option value="Assets">Assets</option>
									<option value="Liabilities">Liabilities</option>
									<option value="Equity">Equity</option>
									<option value="Income">Income (Revenue)</option>
									<option value="Expenses">Expenses</option>
								</select>
							</div>

							{/* Balance Type (Debit / Credit) */}
							<div className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-450 uppercase">Normal Balance side</label>
								<select
									value={newAccount.isDebit}
									onChange={(e) => setNewAccount(prev => ({ ...prev, isDebit: e.target.value }))}
									className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
								>
									<option value="true">Debit Side (Asset / Expense)</option>
									<option value="false">Credit Side (Liability / Equity / Revenue)</option>
								</select>
							</div>

							{/* Base Balance */}
							<div className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-450 uppercase">Initial Balance (NGN)</label>
								<input
									type="number"
									step="0.01"
									placeholder="e.g. 500000"
									value={newAccount.baseVal}
									onChange={(e) => setNewAccount(prev => ({ ...prev, baseVal: e.target.value }))}
									className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
								/>
							</div>

							{/* Actions */}
							<div className="flex justify-end gap-2.5 mt-2 pt-4 border-t border-gray-100">
								<button
									type="button"
									onClick={() => setShowAddAccountModal(false)}
									className="px-4 py-2 border border-gray-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-sm shadow-blue-500/10 border-none"
								>
									Register Account
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* MODAL 1: CREATE INVOICE */}
			{showInvoiceModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
					<div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 max-w-md w-full flex flex-col gap-4">
						<div className="flex justify-between items-center pb-2 border-b border-gray-100">
							<h3 className="font-black text-slate-800 text-md">Create Customer Invoice</h3>
							<button onClick={() => setShowInvoiceModal(false)} className="text-slate-400 hover:text-slate-700 font-extrabold text-sm">✕</button>
						</div>
						<form onSubmit={handleCreateInvoice} className="flex flex-col gap-3">
							<div className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-450 uppercase">Customer Name</label>
								<input
									type="text"
									required
									value={newInvoice.customerName}
									onChange={(e) => setNewInvoice({ ...newInvoice, customerName: e.target.value })}
									placeholder="e.g. Dangote Group Plc"
									className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-450 uppercase">Customer Email</label>
								<input
									type="email"
									required
									value={newInvoice.customerEmail}
									onChange={(e) => setNewInvoice({ ...newInvoice, customerEmail: e.target.value })}
									placeholder="e.g. billing@dangote.com"
									className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
								/>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-1">
									<label className="text-[10px] font-bold text-slate-455 uppercase">Amount (NGN)</label>
									<input
										type="number"
										required
										min="1"
										step="0.01"
										value={newInvoice.amount}
										onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
										placeholder="250000"
										className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-[10px] font-bold text-slate-455 uppercase">Due Date</label>
									<input
										type="date"
										required
										value={newInvoice.dueDate}
										onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
										className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
									/>
								</div>
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-455 uppercase">Description</label>
								<textarea
									rows={3}
									value={newInvoice.description}
									onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
									placeholder="Provide billing items or contract description..."
									className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
								/>
							</div>
							<button
								type="submit"
								className="mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
							>
								Generate Invoice
							</button>
						</form>
					</div>
				</div>
			)}

			{/* MODAL 2: REQUEST EXPENSE */}
			{showExpenseModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
					<div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 max-w-md w-full flex flex-col gap-4">
						<div className="flex justify-between items-center pb-2 border-b border-gray-100">
							<h3 className="font-black text-slate-800 text-md">Request Imprest / Expense</h3>
							<button onClick={() => setShowExpenseModal(false)} className="text-slate-400 hover:text-slate-700 font-extrabold text-sm">✕</button>
						</div>
						<form onSubmit={handleRequestExpense} className="flex flex-col gap-3">
							<div className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-455 uppercase">Expense Title</label>
								<input
									type="text"
									required
									value={newExpense.title}
									onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
									placeholder="e.g. Lagos Terminal Maintenance Repairs"
									className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
								/>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-1">
									<label className="text-[10px] font-bold text-slate-455 uppercase">Category</label>
									<select
										value={newExpense.category}
										onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
										className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
									>
										<option value="Fleet Operations">Fleet Operations</option>
										<option value="Office Administration">Office Administration</option>
										<option value="Petty Cash">Petty Cash</option>
										<option value="Marketing & CSR">Marketing & CSR</option>
										<option value="Workshop Spareparts">Workshop Spareparts</option>
									</select>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-[10px] font-bold text-slate-455 uppercase">Amount (NGN)</label>
									<input
										type="number"
										required
										min="1"
										value={newExpense.amount}
										onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
										placeholder="150000"
										className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
									/>
								</div>
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-455 uppercase">Description</label>
								<textarea
									rows={3}
									value={newExpense.description}
									onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
									placeholder="Provide details about the requested cash imprest or vendor invoice..."
									className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
								/>
							</div>
							<button
								type="submit"
								className="mt-2 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
							>
								Submit Request
							</button>
						</form>
					</div>
				</div>
			)}

			{/* MODAL 3: RECONCILIATION */}
			{showReconcileModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
					<div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 max-w-md w-full flex flex-col gap-4">
						<div className="flex justify-between items-center pb-2 border-b border-gray-100">
							<h3 className="font-black text-slate-800 text-md">New Reconciliation Audit</h3>
							<button onClick={() => setShowReconcileModal(false)} className="text-slate-400 hover:text-slate-700 font-extrabold text-sm">✕</button>
						</div>
						<form onSubmit={handleCreateReconciliation} className="flex flex-col gap-3">
							<div className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-455 uppercase">Audit Title</label>
								<input
									type="text"
									required
									value={newReconcile.title}
									onChange={(e) => setNewReconcile({ ...newReconcile, title: e.target.value })}
									placeholder="e.g. Weekly Shuttle Run Reconciliation (Week 28)"
									className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
								/>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-1">
									<label className="text-[10px] font-bold text-slate-455 uppercase">Type</label>
									<select
										value={newReconcile.type}
										onChange={(e) => setNewReconcile({ ...newReconcile, type: e.target.value })}
										className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
									>
										<option value="Shuttle">Shuttle</option>
										<option value="Logistics">Logistics</option>
										<option value="KHLC">KHLC</option>
										<option value="Rental Bus">Rental Bus</option>
									</select>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-[10px] font-bold text-slate-455 uppercase">Expected (System)</label>
									<input
										type="number"
										required
										value={newReconcile.expectedAmount}
										onChange={(e) => setNewReconcile({ ...newReconcile, expectedAmount: e.target.value })}
										placeholder="e.g. 1200000"
										className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
									/>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-1">
									<label className="text-[10px] font-bold text-slate-455 uppercase">Actual (Bank)</label>
									<input
										type="number"
										required
										value={newReconcile.actualAmount}
										onChange={(e) => setNewReconcile({ ...newReconcile, actualAmount: e.target.value })}
										placeholder="e.g. 1200000"
										className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-[10px] font-bold text-slate-455 uppercase">Period Start</label>
									<input
										type="date"
										required
										value={newReconcile.periodStart}
										onChange={(e) => setNewReconcile({ ...newReconcile, periodStart: e.target.value })}
										className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
									/>
								</div>
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-455 uppercase">Period End</label>
								<input
									type="date"
									required
									value={newReconcile.periodEnd}
									onChange={(e) => setNewReconcile({ ...newReconcile, periodEnd: e.target.value })}
									className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-455 uppercase">Notes / Explanations</label>
								<textarea
									rows={3}
									value={newReconcile.notes}
									onChange={(e) => setNewReconcile({ ...newReconcile, notes: e.target.value })}
									placeholder="Provide notes if there's a discrepancy (e.g. bank charges)..."
									className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
								/>
							</div>
							<button
								type="submit"
								className="mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
							>
								Log Reconciliation
							</button>
						</form>
					</div>
				</div>
			)}
		</ERPLayout>
	);
}
