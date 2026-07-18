"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
	IconDownload, 
	IconSearch,
	IconLayoutDashboard,
	IconTrendingUp,
	IconTrendingDown,
	IconReceiptTax,
	IconFileInvoice,
	IconFileSpreadsheet,
	IconArrowLeftRight
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

export default function FinanceReportsPage() {
	const router = useRouter();

	const [activeReportView, setActiveReportView] = useState("transactions");
	const [startDate, setStartDate] = useState("01/01/2026");
	const [endDate, setEndDate] = useState("31/12/2026");
	const [selectedAccount, setSelectedAccount] = useState("All accounts");

	const reportViews: ReportViewCard[] = [
		{ id: "transactions", title: "Transactions", desc: "Ledger activity", icon: "🔄" },
		{ id: "statement", title: "Account Statement", desc: "Account movement", icon: "📑" },
		{ id: "income", title: "Income", desc: "Revenue trend", icon: "📈" },
		{ id: "expense", title: "Expense", desc: "Spend trend", icon: "📉" },
		{ id: "income-vs-expense", title: "Income vs Expense", desc: "Profit picture", icon: "📊" },
		{ id: "tax", title: "Tax", desc: "Tax exposure", icon: "💼" },
		{ id: "income-statement", title: "Income Statement", desc: "Financial Performance", icon: "📋" },
		{ id: "invoice", title: "Invoice", desc: "Receivables", icon: "📄" },
		{ id: "bill", title: "Bill", desc: "Payables", icon: "📝" },
		{ id: "vendor-prices", title: "Vendor Prices", desc: "Purchase price history", icon: "🏷️" },
		{ id: "product-stock", title: "Product Stock", desc: "Inventory movement", icon: "📦" }
	];

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

	const formatNaira = (amount: number) => {
		if (amount === 0) return "₦0.00";
		const formatted = new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			minimumFractionDigits: 2
		}).format(Math.abs(amount));
		return amount < 0 ? `-${formatted}` : formatted;
	};

	return (
		<div className="flex flex-col gap-6 animate-fadeIn text-[#1e293b]">
			
			{/* Header */}
			<div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100/40">
				<div>
					<h2 className="text-[20px] font-black text-slate-800 tracking-tight">Transaction Summary</h2>
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

			{/* Report View Picker Card */}
			<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/40 flex flex-col gap-4 text-left">
				<span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Finance Reports</span>
				<h3 className="font-extrabold text-slate-800 text-sm -mt-2">Choose a report view</h3>
				
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-1">
					{reportViews.map(view => (
						<button
							key={view.id}
							onClick={() => setActiveReportView(view.id)}
							className={`p-3.5 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
								activeReportView === view.id
									? "bg-red-50 border-red-55 text-red-650 shadow-sm"
									: "bg-white border-gray-150 text-slate-600 hover:bg-slate-50"
							}`}
						>
							<div className="text-xl">{view.icon}</div>
							<div>
								<p className="text-[11px] font-black leading-tight">{view.title}</p>
								<p className="text-[9px] text-slate-450 font-semibold mt-0.5">{view.desc}</p>
							</div>
						</button>
					))}
				</div>
			</div>

			{/* Filters and Selection Parameters */}
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
					<label className="text-[10px] font-bold text-slate-455 block mb-1 uppercase">Account</label>
					<select
						value={selectedAccount}
						onChange={(e) => setSelectedAccount(e.target.value)}
						className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-bold"
					>
						<option value="All accounts">All accounts</option>
						<option value="Cash and Bank">Cash and Bank</option>
						<option value="Operating Expenses">Operating Expenses</option>
					</select>
				</div>
				<div className="md:col-span-2">
					<button
						onClick={() => alert("Searching report entries...")}
						className="w-full py-2.5 bg-red-500 hover:bg-red-650 text-white font-extrabold rounded-xl text-xs flex items-center justify-center cursor-pointer shadow-sm transition-colors border-none outline-none"
					>
						<IconSearch className="w-4 h-4 stroke-[3]" />
					</button>
				</div>
			</div>

			{/* Summary Details Row */}
			<div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100/40 grid grid-cols-2 gap-4 text-left">
				<div>
					<span className="text-[9px] font-bold text-slate-400 block uppercase">Report</span>
					<span className="text-xs font-black text-slate-800">Transaction Summary</span>
				</div>
				<div>
					<span className="text-[9px] font-bold text-slate-400 block uppercase">Duration</span>
					<span className="text-xs font-black text-slate-800">Jan-2026 to Dec-2026</span>
				</div>
			</div>

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

			{/* Main log list Table */}
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
							{transactionRows.map((row, idx) => (
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

				{/* Table Pagination matching screenshot details */}
				<div className="flex justify-end gap-1 pt-4 border-t border-gray-55/60 mt-2">
					<button className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-slate-400 rounded-xl text-[10px] font-extrabold cursor-not-allowed" disabled>
						‹
					</button>
					<button className="w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-extrabold bg-red-500 text-white shadow-sm">
						1
					</button>
					<button className="w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-extrabold border border-gray-200 text-slate-600 hover:bg-gray-50 cursor-pointer">
						2
					</button>
					<button className="w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-extrabold border border-gray-200 text-slate-600 hover:bg-gray-50 cursor-pointer">
						3
					</button>
					<button className="w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-extrabold border border-gray-200 text-slate-600 hover:bg-gray-50 cursor-pointer">
						4
					</button>
					<span className="px-1 text-slate-400 font-bold">...</span>
					<button className="w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-extrabold border border-gray-200 text-slate-600 hover:bg-gray-50 cursor-pointer">
						44
					</button>
					<button className="w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-extrabold border border-gray-200 text-slate-600 hover:bg-gray-50 cursor-pointer">
						45
					</button>
					<button className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-slate-500 rounded-xl text-[10px] font-extrabold cursor-pointer">
						›
					</button>
				</div>
			</div>

		</div>
	);
}
