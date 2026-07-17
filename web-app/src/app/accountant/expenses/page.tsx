"use client";

import React from "react";
import { useFinance } from "../FinanceContext";

export default function AccountantExpenses() {
	const {
		stats,
		expenses,
		formatNaira,
		setShowExpenseModal,
		handleUpdateExpenseStatus
	} = useFinance();

	return (
		<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 animate-fadeIn">
			<div className="flex justify-between items-center pb-3 border-b border-gray-100 flex-wrap gap-2">
				<div>
					<h3 className="font-bold text-slate-800 text-sm">Imprests & Expenses (Payables)</h3>
					<p className="text-[10px] text-slate-400 font-semibold">Awaiting Settlement: {formatNaira(stats.pendingPayables)}</p>
				</div>
				<button
					onClick={() => setShowExpenseModal(true)}
					className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-all cursor-pointer border-none"
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
												className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[9px] cursor-pointer border-none"
											>
												Approve
											</button>
											<button
												onClick={() => handleUpdateExpenseStatus(exp.id, "Rejected")}
												className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-[9px] cursor-pointer border-none"
											>
												Reject
											</button>
										</>
									)}
									{exp.status === "Approved" && (
										<button
											onClick={() => handleUpdateExpenseStatus(exp.id, "Disbursed")}
											className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] cursor-pointer border-none"
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
	);
}
