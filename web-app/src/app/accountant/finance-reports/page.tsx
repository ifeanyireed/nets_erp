"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
	IconDownload, 
	IconSearch,
	IconLayoutDashboard,
	IconTrendingUp,
	IconTrendingDown,
	IconArrowUpRight,
	IconArrowDownRight,
	IconCheck
} from "@tabler/icons-react";

const REPORTS_TABS = [
	{ id: "finance-reports", label: "Finance Reports", slug: "/accountant/finance-reports" },
	{ id: "ledger-summary", label: "Ledger Summary", slug: "/accountant/ledger-summary" },
	{ id: "trial-balance", label: "Trial Balance", slug: "/accountant/trial-balance" },
	{ id: "financial-position", label: "Financial Position", slug: "/accountant/financial-position" },
	{ id: "aged-receivables", label: "Aged Receivables", slug: "/accountant/aged-receivables" },
	{ id: "aged-payables", label: "Aged Payables", slug: "/accountant/aged-payables" }
];

interface ReportViewCard {
	id: string;
	title: string;
	desc: string;
	icon: React.ReactNode;
}

interface TransactionRow {
	date: string;
	account: string;
	type: string;
	ref: string;
	desc: string;
	debit: number;
	credit: number;
}

interface IncomeExpenseRow {
	category: string;
	type: "Income" | "Expense";
	amount: number;
	percentage: number;
}

interface SalesReportRow {
	client: string;
	totalInvoiced: number;
	invoiceCount: number;
	avgValue: number;
	status: string;
}

export default function FinanceReportsPage() {
	const router = useRouter();

	const [activeReportView, setActiveReportView] = useState("transactions");
	const [startDate, setStartDate] = useState("01/01/2026");
	const [endDate, setEndDate] = useState("31/12/2026");
	const [selectedAccount, setSelectedAccount] = useState("All accounts");
	const [searchQuery, setSearchQuery] = useState("");

	const reportViews: ReportViewCard[] = [
		{ id: "transactions", title: "Transactions", desc: "Ledger activity", icon: "🔄" },
		{ id: "income-vs-expense", title: "Income vs Expense", desc: "Profit picture", icon: "⚖️" },
		{ id: "sales", title: "Sales Report", desc: "Customer sales metrics", icon: "📊" },
		{ id: "statement", title: "Account Statement", desc: "Account movement", icon: "📑" },
		{ id: "income", title: "Income", desc: "Revenue trend", icon: "📈" },
		{ id: "expense", title: "Expense", desc: "Spend trend", icon: "📉" },
		{ id: "tax", title: "Tax", desc: "Tax exposure", icon: "💼" },
		{ id: "income-statement", title: "Income Statement", desc: "Financial Performance", icon: "📋" },
		{ id: "invoice", title: "Invoice", desc: "Receivables", icon: "📄" },
		{ id: "bill", title: "Bill", desc: "Payables", icon: "📝" },
		{ id: "product-stock", title: "Product Stock", desc: "Inventory movement", icon: "📦" }
	];

	// Data for Transactions View (Finance Report)
	const transactionRows: TransactionRow[] = [
		{ date: "17-07-2026", account: "Operating Expenses", type: "Expenses", ref: "LND 644 YD", desc: "LND 644 YD", debit: 10000.00, credit: 0 },
		{ date: "17-07-2026", account: "Cash and Bank", type: "Assets", ref: "LND 644 YD", desc: "Expense paid", debit: 0, credit: 10000.00 },
		{ date: "17-07-2026", account: "Operating Expenses", type: "Expenses", ref: "APP 257 YD", desc: "APP 257 YD", debit: 48000.00, credit: 0 },
		{ date: "17-07-2026", account: "Cash and Bank", type: "Assets", ref: "APP 257 YD", desc: "Expense paid", debit: 0, credit: 48000.00 },
		{ date: "17-07-2026", account: "Operating Expenses", type: "Expenses", ref: "AGL 706 KF", desc: "AGL 706 KF", debit: 4000.00, credit: 0 },
		{ date: "17-07-2026", account: "Cash and Bank", type: "Assets", ref: "AGL 706 KF", desc: "Expense paid", debit: 0, credit: 4000.00 },
		{ date: "17-07-2026", account: "Operating Expenses", type: "Expenses", ref: "Purchases of tyres, tube and rim", desc: "Purchases of tyres, tube and rim", debit: 527000.00, credit: 0 },
		{ date: "17-07-2026", account: "Cash and Bank", type: "Assets", ref: "Purchases of tyres, tube and rim", desc: "Expense paid", debit: 0, credit: 527000.00 },
		{ date: "17-07-2026", account: "Operating Expenses", type: "Expenses", ref: "Transport to move the tyres to CBT", desc: "Transport to move the tyres to CBT", debit: 6000.00, credit: 0 },
		{ date: "17-07-2026", account: "Cash and Bank", type: "Assets", ref: "Transport to move the tyres to CBT", desc: "Expense paid", debit: 0, credit: 6000.00 }
	];

	// Data for Income vs Expense View
	const incomeExpenseRows: IncomeExpenseRow[] = [
		{ category: "Professional Service Income", type: "Income", amount: 125000000.00, percentage: 100.0 },
		{ category: "Operating Expenses", type: "Expense", amount: 51739649.75, percentage: 98.9 },
		{ category: "Fleet Repair & Maintenance", type: "Expense", amount: 418000.00, percentage: 0.8 },
		{ category: "Travel & Transportation Expense", type: "Expense", amount: 49000.00, percentage: 0.1 }
	];

	// Data for Sales Report View
	const salesReportRows: SalesReportRow[] = [
		{ client: "Nigerian Bottling Company (NBC)", totalInvoiced: 4779200.00, invoiceCount: 1, avgValue: 4779200.00, status: "Active" },
		{ client: "IHS - Holding Limited", totalInvoiced: 1000000.00, invoiceCount: 4, avgValue: 250000.00, status: "Active" },
		{ client: "Ecologique Transport Solution", totalInvoiced: 455962.50, invoiceCount: 2, avgValue: 227981.25, status: "Active" },
		{ client: "7UP Bottling Company", totalInvoiced: 106375.00, invoiceCount: 2, avgValue: 53187.50, status: "Active" },
		{ client: "Dulux - Chemical & Allied Product PLC", totalInvoiced: 2000.00, invoiceCount: 1, avgValue: 2000.00, status: "Active" }
	];

	const formatNaira = (amount: number) => {
		const formatted = new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			minimumFractionDigits: 2
		}).format(Math.abs(amount));
		return amount < 0 ? `-${formatted}` : formatted;
	};

	const filteredTransactions = transactionRows.filter(row =>
		row.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
		row.ref.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const filteredIncomeExpense = incomeExpenseRows.filter(row =>
		row.category.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const filteredSales = salesReportRows.filter(row =>
		row.client.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="flex flex-col gap-6 animate-fadeIn text-[#1e293b]">
			
			{/* Header */}
			<div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100/40">
				<div>
					<h2 className="text-[20px] font-black text-slate-800 tracking-tight">
						{activeReportView === "transactions" ? "Transaction Summary" :
						 activeReportView === "income-vs-expense" ? "Income vs Expense Report" :
						 "Customer Sales Report"}
					</h2>
					<p className="text-xs text-slate-455 font-semibold mt-1">Finance reports · Jan-2026 to Dec-2026</p>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => alert("Exporting report...")}
						className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-gray-200 text-slate-700 font-extrabold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
					>
						<IconDownload className="w-4 h-4 text-slate-455" />
						Export CSV
					</button>
					<button
						onClick={() => router.push("/accountant/overview")}
						className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-gray-200 text-slate-700 font-extrabold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
					>
						Finance Hub
					</button>
				</div>
			</div>

			{/* Sub-menu Tabs */}
			<div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100/40">
				<div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide gap-1">
					{REPORTS_TABS.map((tab) => (
						<button
							key={tab.id}
							onClick={() => router.push(tab.slug)}
							className={`px-5 py-3 font-extrabold text-xs whitespace-nowrap border-b-2 transition-all cursor-pointer ${
								tab.id === "finance-reports"
									? "border-red-500 text-red-500 font-bold"
									: "border-transparent text-slate-400 hover:text-slate-700"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>

			{/* Choose a report view cards */}
			<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/40 flex flex-col gap-4 text-left">
				<span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Finance Reports</span>
				<h3 className="font-extrabold text-slate-800 text-sm -mt-2">Choose a report view</h3>
				
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-1">
					{reportViews.map(view => (
						<button
							key={view.id}
							onClick={() => {
								setActiveReportView(view.id);
								setSearchQuery("");
							}}
							className={`p-3.5 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
								activeReportView === view.id
									? "bg-red-50 border-red-55 text-red-650 shadow-sm"
									: "bg-white border-gray-150 text-slate-600 hover:bg-slate-50"
							}`}
						>
							<div className="text-xl">{view.icon}</div>
							<div>
								<p className="text-[11px] font-black leading-tight">{view.title}</p>
								<p className="text-[9px] text-slate-455 font-semibold mt-0.5">{view.desc}</p>
							</div>
						</button>
					))}
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/40 grid grid-cols-1 md:grid-cols-12 gap-4 items-end text-left">
				<div className="md:col-span-3">
					<label className="text-[10px] font-bold text-slate-455 block mb-1 uppercase">Start Date</label>
					<input
						type="text"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 font-semibold"
					/>
				</div>
				<div className="md:col-span-3">
					<label className="text-[10px] font-bold text-slate-455 block mb-1 uppercase">End Date</label>
					<input
						type="text"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 font-semibold"
					/>
				</div>
				<div className="md:col-span-4">
					<label className="text-[10px] font-bold text-slate-455 block mb-1 uppercase">Search Query</label>
					<div className="relative">
						<input
							type="text"
							placeholder="Search within report view..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold outline-none"
						/>
						<IconSearch className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
					</div>
				</div>
				<div className="md:col-span-2">
					<button
						onClick={() => alert("Re-calculating view filters...")}
						className="w-full py-2.5 bg-red-500 hover:bg-red-655 text-white font-extrabold rounded-xl text-xs flex items-center justify-center cursor-pointer shadow-sm transition-colors border-none outline-none"
					>
						Recalculate
					</button>
				</div>
			</div>

			{/* DYNAMIC CONTENT BLOCK */}
			{activeReportView === "transactions" && (
				<>
					{/* Stat cards grid layout */}
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						<div className="bg-white rounded-3xl p-5 border border-gray-100/40 shadow-sm text-left flex flex-col gap-1">
							<span className="text-[10px] font-bold text-slate-400 font-mono">5000</span>
							<p className="text-[11px] font-extrabold text-slate-500 leading-tight">Operating Expenses</p>
							<p className="text-sm font-black text-slate-850 mt-1">{formatNaira(51739649.75)}</p>
						</div>
						<div className="bg-white rounded-3xl p-5 border border-gray-100/40 shadow-sm text-left flex flex-col gap-1">
							<span className="text-[10px] font-bold text-slate-400 font-mono">20100</span>
							<p className="text-[11px] font-extrabold text-slate-500 leading-tight">FLEET REPAIR AND MAINTENANCE - IHS ENUGU</p>
							<p className="text-sm font-black text-slate-850 mt-1">{formatNaira(418000.00)}</p>
						</div>
						<div className="bg-white rounded-3xl p-5 border border-gray-100/40 shadow-sm text-left flex flex-col gap-1">
							<span className="text-[10px] font-bold text-slate-400 font-mono">2000</span>
							<p className="text-[11px] font-extrabold text-slate-500 leading-tight">Accounts Payable</p>
							<p className="text-sm font-black text-slate-850 mt-1">{formatNaira(0.00)}</p>
						</div>
						<div className="bg-white rounded-3xl p-5 border border-gray-100/40 shadow-sm text-left flex flex-col gap-1">
							<span className="text-[10px] font-bold text-slate-400 font-mono">1040</span>
							<p className="text-[11px] font-extrabold text-slate-500 leading-tight">Monie Point - New Era Transports</p>
							<p className="text-sm font-black text-slate-850 mt-1">{formatNaira(-48500.00)}</p>
						</div>
						<div className="bg-white rounded-3xl p-5 border border-gray-100/40 shadow-sm text-left flex flex-col gap-1">
							<span className="text-[10px] font-bold text-slate-400 font-mono">1001</span>
							<p className="text-[11px] font-extrabold text-slate-500 leading-tight">GTB</p>
							<p className="text-sm font-black text-slate-850 mt-1">{formatNaira(-49000.00)}</p>
						</div>
						<div className="bg-white rounded-3xl p-5 border border-gray-100/40 shadow-sm text-left flex flex-col gap-1">
							<span className="text-[10px] font-bold text-slate-400 font-mono">1000</span>
							<p className="text-[11px] font-extrabold text-slate-500 leading-tight">Cash and Bank</p>
							<p className="text-sm font-black text-slate-850 mt-1">{formatNaira(-52060149.75)}</p>
						</div>
					</div>

					{/* Log List Table */}
					<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/40 flex flex-col gap-4">
						<div className="overflow-x-auto min-h-60">
							<table className="w-full text-left border-collapse select-none">
								<thead>
									<tr className="border-b border-gray-100 text-slate-455 text-[11px] font-bold uppercase tracking-wider">
										<th className="pb-3 min-w-[110px]">Date</th>
										<th className="pb-3 min-w-[150px]">Account</th>
										<th className="pb-3 min-w-[110px]">Type</th>
										<th className="pb-3 min-w-[180px]">Reference</th>
										<th className="pb-3 min-w-[220px]">Description</th>
										<th className="pb-3 min-w-[130px]">Debit</th>
										<th className="pb-3 min-w-[130px]">Credit</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-50 text-xs">
									{filteredTransactions.map((row, idx) => (
										<tr key={idx} className="hover:bg-slate-50/50 transition-colors font-semibold text-slate-700">
											<td className="py-4 text-slate-550 font-mono">{row.date}</td>
											<td className="py-4 text-slate-800 font-bold">{row.account}</td>
											<td className="py-4 text-slate-500">{row.type}</td>
											<td className="py-4 text-slate-600 font-mono">{row.ref}</td>
											<td className="py-4 text-slate-500 max-w-xs truncate">{row.desc}</td>
											<td className="py-4 text-emerald-650 font-bold">{formatNaira(row.debit)}</td>
											<td className="py-4 text-red-500 font-bold">{formatNaira(row.credit)}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</>
			)}

			{activeReportView === "income-vs-expense" && (
				<>
					{/* Summary Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="bg-white rounded-3xl p-5 border border-gray-100/40 shadow-sm text-left flex flex-col gap-1">
							<div className="flex justify-between items-center text-slate-400">
								<span className="text-[10px] font-bold uppercase tracking-wider">Total Income</span>
								<IconArrowUpRight className="w-5 h-5 text-emerald-500" />
							</div>
							<p className="text-xl font-black text-emerald-650 mt-2">{formatNaira(125000000.00)}</p>
							<p className="text-[10px] text-slate-455 mt-1 font-semibold">Deposited professional earnings</p>
						</div>

						<div className="bg-white rounded-3xl p-5 border border-gray-100/40 shadow-sm text-left flex flex-col gap-1">
							<div className="flex justify-between items-center text-slate-400">
								<span className="text-[10px] font-bold uppercase tracking-wider">Total Expenses</span>
								<IconArrowDownRight className="w-5 h-5 text-red-500" />
							</div>
							<p className="text-xl font-black text-red-500 mt-2">{formatNaira(52206649.75)}</p>
							<p className="text-[10px] text-slate-455 mt-1 font-semibold">Operating and maintenance payables</p>
						</div>

						<div className="bg-white rounded-3xl p-5 border border-gray-100/40 shadow-sm text-left flex flex-col gap-1">
							<div className="flex justify-between items-center text-slate-400">
								<span className="text-[10px] font-bold uppercase tracking-wider">Net Profit</span>
								<span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded uppercase">Surplus</span>
							</div>
							<p className="text-xl font-black text-blue-600 mt-2">{formatNaira(72793350.25)}</p>
							<p className="text-[10px] text-slate-455 mt-1 font-semibold">Post-expenditure ledger surplus</p>
						</div>
					</div>

					{/* Breakdown Table */}
					<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/40 flex flex-col gap-4">
						<div className="overflow-x-auto min-h-60">
							<table className="w-full text-left border-collapse select-none">
								<thead>
									<tr className="border-b border-gray-100 text-slate-455 text-[11px] font-bold uppercase tracking-wider">
										<th className="pb-3 min-w-[250px]">Category</th>
										<th className="pb-3 min-w-[120px]">Type</th>
										<th className="pb-3 min-w-[150px]">Amount</th>
										<th className="pb-3 min-w-[150px]">Share of Group</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-50 text-xs font-semibold text-slate-700">
									{filteredIncomeExpense.map((row, idx) => (
										<tr key={idx} className="hover:bg-slate-50/50 transition-colors">
											<td className="py-4 text-slate-800 font-bold">{row.category}</td>
											<td className="py-4">
												<span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${
													row.type === "Income" 
														? "bg-emerald-50 border-emerald-100 text-emerald-700" 
														: "bg-red-50 border-red-100 text-red-700"
												}`}>
													{row.type}
												</span>
											</td>
											<td className={`py-4 font-black ${row.type === "Income" ? "text-emerald-650" : "text-slate-805"}`}>
												{formatNaira(row.amount)}
											</td>
											<td className="py-4 text-slate-550">{row.percentage.toFixed(1)}%</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</>
			)}

			{activeReportView === "sales" && (
				<>
					{/* Sales Summary Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="bg-white rounded-3xl p-5 border border-gray-100/40 shadow-sm text-left flex flex-col gap-1">
							<span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Total Sales Invoiced</span>
							<p className="text-xl font-black text-slate-800 mt-2">{formatNaira(6343537.50)}</p>
							<p className="text-[10px] text-slate-455 mt-1 font-semibold">Combined value of sales accounts</p>
						</div>

						<div className="bg-white rounded-3xl p-5 border border-gray-100/40 shadow-sm text-left flex flex-col gap-1">
							<span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Total Paid Collections</span>
							<p className="text-xl font-black text-emerald-650 mt-2">{formatNaira(0.00)}</p>
							<p className="text-[10px] text-slate-455 mt-1 font-semibold">Cleared cash in transit receipts</p>
						</div>

						<div className="bg-white rounded-3xl p-5 border border-gray-100/40 shadow-sm text-left flex flex-col gap-1">
							<span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Aged Receivables (Outstanding)</span>
							<p className="text-xl font-black text-red-500 mt-2">{formatNaira(6343537.50)}</p>
							<p className="text-[10px] text-slate-455 mt-1 font-semibold">Aged sales awaiting reconciliation</p>
						</div>
					</div>

					{/* Customer Sales Table */}
					<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/40 flex flex-col gap-4">
						<div className="overflow-x-auto min-h-60">
							<table className="w-full text-left border-collapse select-none">
								<thead>
									<tr className="border-b border-gray-100 text-slate-455 text-[11px] font-bold uppercase tracking-wider">
										<th className="pb-3 min-w-[250px]">Client / Partner Name</th>
										<th className="pb-3 min-w-[120px]">Total Invoiced</th>
										<th className="pb-3 min-w-[100px]">Invoice Count</th>
										<th className="pb-3 min-w-[130px]">Avg Invoice Value</th>
										<th className="pb-3 text-right w-24">Status</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-50 text-xs font-semibold text-slate-700">
									{filteredSales.map((row, idx) => (
										<tr key={idx} className="hover:bg-slate-50/50 transition-colors">
											<td className="py-4 text-blue-600 font-extrabold hover:underline cursor-pointer">{row.client}</td>
											<td className="py-4 text-slate-850 font-black">{formatNaira(row.totalInvoiced)}</td>
											<td className="py-4 text-slate-600">{row.invoiceCount}</td>
											<td className="py-4 text-slate-550">{formatNaira(row.avgValue)}</td>
											<td className="py-4 text-right">
												<span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold text-[9px] px-2 py-0.5 rounded-md uppercase">
													{row.status}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</>
			)}

		</div>
	);
}
