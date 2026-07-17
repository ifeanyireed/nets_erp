"use client";

import React from "react";
import { useFinance } from "../FinanceContext";

export default function AccountantReconcile() {
	const {
		reconciliations,
		formatNaira,
		setShowReconcileModal,
		handleResolveReconciliation
	} = useFinance();

	return (
		<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 animate-fadeIn">
			<div className="flex justify-between items-center pb-3 border-b border-gray-100 flex-wrap gap-2">
				<div>
					<h3 className="font-bold text-slate-800 text-sm">Bank Reconciliation Ledger</h3>
					<p className="text-[10px] text-slate-400 font-semibold">Match transaction values with bank statement records.</p>
				</div>
				<button
					onClick={() => setShowReconcileModal(true)}
					className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer border-none"
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
								<td className={`py-4 text-xs font-black ${rec.discrepancy === 0 ? "text-emerald-600" : "text-red-600"}`}>
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
											className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] cursor-pointer border-none"
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
	);
}
