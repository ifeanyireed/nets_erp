"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
	IconDownload, 
	IconCheck,
	IconTrendingUp,
	IconReportMoney
} from "@tabler/icons-react";

const REPORTS_TABS = [
	{ id: "finance-reports", label: "Finance Reports", slug: "/accountant/finance-reports" },
	{ id: "ledger-summary", label: "Ledger Summary", slug: "/accountant/ledger-summary" },
	{ id: "trial-balance", label: "Trial Balance", slug: "/accountant/trial-balance" },
	{ id: "income-statement", label: "Income Statement", slug: "/accountant/income-statement" },
	{ id: "financial-position", label: "Financial Position", slug: "/accountant/financial-position" },
	{ id: "aged-receivables", label: "Aged Receivables", slug: "/accountant/aged-receivables" },
	{ id: "aged-payables", label: "Aged Payables", slug: "/accountant/aged-payables" }
];

export default function IncomeStatementPage() {
	const router = useRouter();

	const [incomeStatement] = useState({
		revenue: {
			haulageRevenue: 125000000.00,
			otherRevenue: 0.00
		},
		costOfSales: {
			fuelDirectCost: 22500000.00,
			driverAllowances: 10800000.00,
			loadingCharges: 0.00
		},
		operatingExpenses: {
			fleetRepairMaintenance: 5270000.00,
			salariesWages: 12400000.00,
			depreciationTrucks: 8500000.00,
			adminOfficeExpenses: 2200000.00,
			financeCharges: 85000.00
		},
		tax: {
			incomeTax: 18973500.00
		}
	});

	const totalRevenue = incomeStatement.revenue.haulageRevenue + incomeStatement.revenue.otherRevenue;
	const totalCostOfSales = incomeStatement.costOfSales.fuelDirectCost + incomeStatement.costOfSales.driverAllowances + incomeStatement.costOfSales.loadingCharges;
	const grossProfit = totalRevenue - totalCostOfSales;
	
	const totalOperatingExpenses = incomeStatement.operatingExpenses.fleetRepairMaintenance + 
		incomeStatement.operatingExpenses.salariesWages + 
		incomeStatement.operatingExpenses.depreciationTrucks + 
		incomeStatement.operatingExpenses.adminOfficeExpenses + 
		incomeStatement.operatingExpenses.financeCharges;

	const operatingProfit = grossProfit - totalOperatingExpenses;
	const netIncome = operatingProfit - incomeStatement.tax.incomeTax;

	const formatNaira = (amount: number) => {
		const formatted = new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			minimumFractionDigits: 2
		}).format(Math.abs(amount));
		return amount < 0 ? `-${formatted}` : formatted;
	};

	return (
		<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/40 flex flex-col gap-6 animate-fadeIn text-[#1e293b]">
			
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
				<div>
					<h2 className="text-[20px] font-black text-slate-800 tracking-tight">Income Statement</h2>
					<p className="text-xs text-slate-455 font-semibold mt-1">Profit & Loss · Statement of Financial Performance for FY26</p>
				</div>
				<button
					onClick={() => alert("Exporting Income Statement...")}
					className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-gray-200 text-slate-700 font-extrabold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all outline-none self-start sm:self-center"
				>
					<IconDownload className="w-4 h-4 text-slate-455" />
					Export Report
				</button>
			</div>

			{/* Sub-menu Tabs */}
			<div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide gap-1">
				{REPORTS_TABS.map((tab) => (
					<button
						key={tab.id}
						onClick={() => router.push(tab.slug)}
						className={`px-5 py-3 font-extrabold text-xs whitespace-nowrap border-b-2 transition-all cursor-pointer ${
							tab.id === "income-statement"
								? "border-red-500 text-red-500 font-bold"
								: "border-transparent text-slate-400 hover:text-slate-700"
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* Financial Summary Banner */}
			{netIncome > 0 && (
				<div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex gap-3 text-emerald-800 text-xs font-semibold">
					<IconTrendingUp className="w-5 h-5 text-emerald-600 shrink-0 stroke-[3]" />
					<p>Company operating with positive net margins! Net Income for current period is {formatNaira(netIncome)}.</p>
				</div>
			)}

			{/* Income Statement Table Layout */}
			<div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm mt-2 text-xs">
				<div className="grid grid-cols-12 gap-3 px-6 py-4 bg-slate-900 text-white font-black uppercase tracking-wider text-[10px]">
					<div className="col-span-8">Financial Particulars</div>
					<div className="col-span-4 text-right">Amount (₦)</div>
				</div>

				<div className="divide-y divide-slate-100 font-semibold text-slate-700">
					{/* REVENUE */}
					<div className="px-6 py-3 bg-slate-50/50 flex justify-between items-center text-slate-900 font-bold uppercase tracking-tight text-[10px] border-b border-slate-200">
						<span>Revenue</span>
						<span></span>
					</div>
					<div className="grid grid-cols-12 gap-3 px-8 py-3 items-center">
						<div className="col-span-8 text-slate-650">Haulage & Freight Revenue</div>
						<div className="col-span-4 text-right font-mono">{formatNaira(incomeStatement.revenue.haulageRevenue)}</div>
					</div>
					<div className="grid grid-cols-12 gap-3 px-8 py-3 items-center">
						<div className="col-span-8 text-slate-650">Other Operating Revenue</div>
						<div className="col-span-4 text-right font-mono">{formatNaira(incomeStatement.revenue.otherRevenue)}</div>
					</div>
					<div className="grid grid-cols-12 gap-3 px-6 py-3 bg-slate-50/20 items-center font-bold text-slate-800">
						<div className="col-span-8">Total Revenue</div>
						<div className="col-span-4 text-right font-mono text-slate-900">{formatNaira(totalRevenue)}</div>
					</div>

					{/* COST OF SALES */}
					<div className="px-6 py-3 bg-slate-50/50 flex justify-between items-center text-slate-900 font-bold uppercase tracking-tight text-[10px] border-b border-slate-200 border-t-2 border-slate-300">
						<span>Cost of Sales</span>
						<span></span>
					</div>
					<div className="grid grid-cols-12 gap-3 px-8 py-3 items-center">
						<div className="col-span-8 text-slate-650">Haulage & Fuel Direct Expenses</div>
						<div className="col-span-4 text-right font-mono">{formatNaira(incomeStatement.costOfSales.fuelDirectCost)}</div>
					</div>
					<div className="grid grid-cols-12 gap-3 px-8 py-3 items-center">
						<div className="col-span-8 text-slate-650">Driver Allowances & Logistics Costs</div>
						<div className="col-span-4 text-right font-mono">{formatNaira(incomeStatement.costOfSales.driverAllowances)}</div>
					</div>
					<div className="grid grid-cols-12 gap-3 px-6 py-3 bg-slate-50/20 items-center font-bold text-slate-800">
						<div className="col-span-8">Total Cost of Sales</div>
						<div className="col-span-4 text-right font-mono text-slate-900">{formatNaira(totalCostOfSales)}</div>
					</div>

					{/* GROSS PROFIT */}
					<div className="grid grid-cols-12 gap-3 px-6 py-3.5 bg-slate-100 items-center font-black text-slate-900 border-t border-b border-slate-300 uppercase tracking-tight">
						<div className="col-span-8">Gross Profit</div>
						<div className="col-span-4 text-right font-mono">{formatNaira(grossProfit)}</div>
					</div>

					{/* OPERATING EXPENSES */}
					<div className="px-6 py-3 bg-slate-50/50 flex justify-between items-center text-slate-900 font-bold uppercase tracking-tight text-[10px] border-b border-slate-200">
						<span>Operating Expenses</span>
						<span></span>
					</div>
					<div className="grid grid-cols-12 gap-3 px-8 py-3 items-center">
						<div className="col-span-8 text-slate-650">Fleet Repair & Maintenance</div>
						<div className="col-span-4 text-right font-mono">{formatNaira(incomeStatement.operatingExpenses.fleetRepairMaintenance)}</div>
					</div>
					<div className="grid grid-cols-12 gap-3 px-8 py-3 items-center">
						<div className="col-span-8 text-slate-650">Salaries and Wages</div>
						<div className="col-span-4 text-right font-mono">{formatNaira(incomeStatement.operatingExpenses.salariesWages)}</div>
					</div>
					<div className="grid grid-cols-12 gap-3 px-8 py-3 items-center">
						<div className="col-span-8 text-slate-650">Depreciation of Trucks & Assets</div>
						<div className="col-span-4 text-right font-mono">{formatNaira(incomeStatement.operatingExpenses.depreciationTrucks)}</div>
					</div>
					<div className="grid grid-cols-12 gap-3 px-8 py-3 items-center">
						<div className="col-span-8 text-slate-650">Administrative & Office Expenses</div>
						<div className="col-span-4 text-right font-mono">{formatNaira(incomeStatement.operatingExpenses.adminOfficeExpenses)}</div>
					</div>
					<div className="grid grid-cols-12 gap-3 px-8 py-3 items-center">
						<div className="col-span-8 text-slate-650">Finance Charges & Bank Fees</div>
						<div className="col-span-4 text-right font-mono">{formatNaira(incomeStatement.operatingExpenses.financeCharges)}</div>
					</div>
					<div className="grid grid-cols-12 gap-3 px-6 py-3 bg-slate-50/20 items-center font-bold text-slate-800 border-b border-slate-200">
						<div className="col-span-8">Total Operating Expenses</div>
						<div className="col-span-4 text-right font-mono text-slate-900">{formatNaira(totalOperatingExpenses)}</div>
					</div>

					{/* OPERATING PROFIT */}
					<div className="grid grid-cols-12 gap-3 px-6 py-3.5 bg-slate-100 items-center font-black text-slate-900 border-t border-b border-slate-300 uppercase tracking-tight">
						<div className="col-span-8">Operating Profit (EBIT)</div>
						<div className="col-span-4 text-right font-mono">{formatNaira(operatingProfit)}</div>
					</div>

					{/* INCOME TAX */}
					<div className="grid grid-cols-12 gap-3 px-8 py-3 items-center">
						<div className="col-span-8 text-slate-650">Company Income Tax (30%)</div>
						<div className="col-span-4 text-right font-mono">{formatNaira(incomeStatement.tax.incomeTax)}</div>
					</div>

					{/* NET INCOME */}
					<div className="grid grid-cols-12 gap-3 px-6 py-4 bg-slate-900 text-white items-center font-black border-t-2 border-slate-900 uppercase tracking-wider text-sm">
						<div className="col-span-8 flex items-center gap-2">
							<IconReportMoney className="w-5 h-5 text-emerald-400 shrink-0" />
							<span>Net Income (Net Profit)</span>
						</div>
						<div className="col-span-4 text-right font-mono text-emerald-400">{formatNaira(netIncome)}</div>
					</div>
				</div>
			</div>

		</div>
	);
}
