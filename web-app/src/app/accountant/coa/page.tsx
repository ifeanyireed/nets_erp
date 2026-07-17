"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useFinance } from "../FinanceContext";

export default function AccountantCOA() {
	const router = useRouter();
	const {
		chartOfAccounts,
		coaSearchQuery,
		setCoaSearchQuery,
		coaFilterType,
		setCoaFilterType,
		setShowAddAccountModal,
		setLedgerSearchQuery,
		formatNaira
	} = useFinance();

	return (
		<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6 animate-fadeIn">
			
			{/* COA Header & Top Action row */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
				<div>
					<h3 className="font-extrabold text-slate-800 text-sm">Chart of Accounts (COA)</h3>
					<p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Organize and manage your general ledger accounts</p>
				</div>
				<button
					onClick={() => setShowAddAccountModal(true)}
					className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm shadow-blue-500/10 active:scale-95 transition-all border-none outline-none"
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
							className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer border-none outline-none ${
								coaFilterType === cat
									? "bg-white text-blue-600 shadow-sm border border-slate-100"
									: "text-slate-450 hover:text-slate-700 bg-transparent"
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
												router.push("/accountant/ledger");
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
	);
}
