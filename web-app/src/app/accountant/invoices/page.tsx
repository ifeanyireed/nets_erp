"use client";

import React from "react";
import { useFinance } from "../FinanceContext";

export default function AccountantInvoices() {
	const {
		stats,
		invoices,
		formatNaira,
		setShowInvoiceModal,
		handleUpdateInvoiceStatus
	} = useFinance();

	return (
		<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 animate-fadeIn">
			<div className="flex justify-between items-center pb-3 border-b border-gray-100 flex-wrap gap-2">
				<div>
					<h3 className="font-bold text-slate-800 text-sm">Customer Invoices (Aged Receivables)</h3>
					<p className="text-[10px] text-slate-400 font-semibold">Total Outstanding: {formatNaira(stats.outstandingInvoice)}</p>
				</div>
				<button
					onClick={() => setShowInvoiceModal(true)}
					className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer border-none"
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
											className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] cursor-pointer border-none"
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
	);
}
