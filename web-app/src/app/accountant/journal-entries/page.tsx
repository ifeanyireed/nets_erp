"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
	IconPlus, 
	IconSearch,
	IconCheck,
	IconTrash 
} from "@tabler/icons-react";

const TRANSACTIONS_TABS = [
	{ id: "journal-entries", label: "Journal Entries", slug: "/accountant/journal-entries" },
	{ id: "recurring-journals", label: "Recurring Journals", slug: "/accountant/recurring-journals" },
	{ id: "reconcile", label: "Bank Reconciliation", slug: "/accountant/reconcile" },
	{ id: "budget-planner", label: "Budget Planner", slug: "/accountant/budget-planner" },
	{ id: "period-close", label: "Period Close", slug: "/accountant/period-close" },
	{ id: "audit-trail", label: "Audit Trail", slug: "/accountant/audit-trail" }
];

interface JournalEntry {
	id: string;
	date: string;
	accountName: string;
	reference: string;
	debit: number;
	credit: number;
}

export default function JournalEntriesPage() {
	const router = useRouter();

	const [journals, setJournals] = useState<JournalEntry[]>([
		{ id: "JE-00002", date: "18-07-2026", accountName: "1030 - Providus Bank", reference: "Interbank Transfer ref #3019", debit: 49000.00, credit: 0 },
		{ id: "JE-00001", date: "18-07-2026", accountName: "1050 - Globus Bank", reference: "Interbank Transfer ref #3019", debit: 0, credit: 49000.00 }
	]);

	const [searchQuery, setSearchQuery] = useState("");
	const [showAddModal, setShowAddModal] = useState(false);

	const [newJournal, setNewJournal] = useState({
		accountName: "1030 - Providus Bank",
		reference: "",
		entryType: "debit" as "debit" | "credit",
		amount: "",
		dateText: "18-07-2026"
	});

	const filteredJournals = journals.filter(j =>
		j.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
		j.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
		j.id.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleAddJournalSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const amount = parseFloat(newJournal.amount);
		if (isNaN(amount) || amount <= 0) {
			alert("Please enter a valid amount");
			return;
		}

		const padNum = String(journals.length + 1).padStart(5, "0");
		const journalData: JournalEntry = {
			id: `JE-${padNum}`,
			date: newJournal.dateText,
			accountName: newJournal.accountName,
			reference: newJournal.reference || "Manual Adjustment",
			debit: newJournal.entryType === "debit" ? amount : 0,
			credit: newJournal.entryType === "credit" ? amount : 0
		};

		setJournals(prev => [journalData, ...prev]);
		setShowAddModal(false);
		setNewJournal({
			accountName: "1030 - Providus Bank",
			reference: "",
			entryType: "debit",
			amount: "",
			dateText: "18-07-2026"
		});
	};

	const handleDeleteJournal = (id: string) => {
		if (confirm(`Are you sure you want to remove journal entry ${id}?`)) {
			setJournals(prev => prev.filter(j => j.id !== id));
		}
	};

	const formatNaira = (amount: number) => {
		if (amount === 0) return "--";
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			minimumFractionDigits: 2
		}).format(amount);
	};

	return (
		<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/40 flex flex-col gap-6 animate-fadeIn text-[#1e293b]">
			
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
				<div>
					<h2 className="text-[20px] font-black text-slate-800 tracking-tight">Journal Entries</h2>
					<p className="text-xs text-slate-455 font-semibold mt-1">Record double-entry ledger adjustments and general journal entries</p>
				</div>
				<button
					onClick={() => setShowAddModal(true)}
					className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all border-none outline-none self-start sm:self-center"
				>
					<IconPlus className="w-4 h-4" />
					Add Journal Entry
				</button>
			</div>

			{/* Sub-menu Tabs */}
			<div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide gap-1">
				{TRANSACTIONS_TABS.map((tab) => (
					<button
						key={tab.id}
						onClick={() => router.push(tab.slug)}
						className={`px-5 py-3 font-extrabold text-xs whitespace-nowrap border-b-2 transition-all cursor-pointer ${
							tab.id === "journal-entries"
								? "border-red-500 text-red-500 font-bold"
								: "border-transparent text-slate-400 hover:text-slate-700"
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* Search */}
			<div className="flex justify-end">
				<div className="relative w-full sm:w-64">
					<input
						type="text"
						placeholder="Search journal entry..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold outline-none"
					/>
					<IconSearch className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
				</div>
			</div>

			{/* Table Grid */}
			<div className="overflow-x-auto min-h-60">
				<table className="w-full text-left border-collapse select-none">
					<thead>
						<tr className="border-b border-gray-100 text-slate-455 text-[11px] font-bold uppercase tracking-wider">
							<th className="pb-3 min-w-[120px]">Journal ID</th>
							<th className="pb-3 min-w-[110px]">Date</th>
							<th className="pb-3 min-w-[200px]">Account</th>
							<th className="pb-3 min-w-[200px]">Reference</th>
							<th className="pb-3 min-w-[120px]">Debit</th>
							<th className="pb-3 min-w-[120px]">Credit</th>
							<th className="pb-3 text-right w-20">Action</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-50">
						{filteredJournals.length > 0 ? (
							filteredJournals.map((j) => (
								<tr key={j.id} className="hover:bg-slate-50/50 transition-colors text-xs font-semibold text-slate-700">
									<td className="py-4 font-mono font-bold text-slate-800">{j.id}</td>
									<td className="py-4 text-slate-550">{j.date}</td>
									<td className="py-4 text-slate-800">{j.accountName}</td>
									<td className="py-4 text-slate-600">{j.reference}</td>
									<td className="py-4 text-emerald-650 font-bold">{formatNaira(j.debit)}</td>
									<td className="py-4 text-red-500 font-bold">{formatNaira(j.credit)}</td>
									<td className="py-4 text-right">
										<button
											onClick={() => handleDeleteJournal(j.id)}
											className="p-1 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg cursor-pointer transition-colors border-none bg-transparent"
										>
											<IconTrash className="w-4 h-4" />
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={7} className="py-12 text-center text-xs text-slate-400 font-bold italic">
									No journal entries found matching filters.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* ADD JOURNAL MODAL */}
			{showAddModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
					<div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-slideUp">
						<div className="flex justify-between items-center p-6 border-b border-gray-100 bg-slate-50/50">
							<div>
								<h3 className="font-extrabold text-slate-800 text-sm">Create Journal Entry</h3>
								<p className="text-[10px] text-slate-455 mt-0.5 font-semibold">Post a manual double-entry accounting ledger transaction</p>
							</div>
							<button
								onClick={() => setShowAddModal(false)}
								className="w-7 h-7 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-sm font-bold border-none bg-transparent"
							>
								✕
							</button>
						</div>

						<form onSubmit={handleAddJournalSubmit} className="p-6 flex flex-col gap-4 text-left">
							<div className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-450 uppercase">Ledger Account</label>
								<select
									value={newJournal.accountName}
									onChange={(e) => setNewJournal(prev => ({ ...prev, accountName: e.target.value }))}
									className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
								>
									<option value="1030 - Providus Bank">1030 - Providus Bank</option>
									<option value="1050 - Globus Bank">1050 - Globus Bank</option>
									<option value="1010 - GT Bank">1010 - GT Bank</option>
									<option value="4000 - Professional Service Income">4000 - Professional Service Income</option>
									<option value="5000 - Travel & Transportation Expense">5000 - Travel & Transportation Expense</option>
								</select>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-1">
									<label className="text-[10px] font-bold text-slate-455 uppercase">Date</label>
									<input
										type="text"
										required
										value={newJournal.dateText}
										onChange={(e) => setNewJournal(prev => ({ ...prev, dateText: e.target.value }))}
										className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-[10px] font-bold text-slate-455 uppercase">Entry Type</label>
									<select
										value={newJournal.entryType}
										onChange={(e) => setNewJournal(prev => ({ ...prev, entryType: e.target.value as any }))}
										className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
									>
										<option value="debit">Debit</option>
										<option value="credit">Credit</option>
									</select>
								</div>
							</div>

							<div className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-455 uppercase">Amount (NGN)</label>
								<input
									type="number"
									required
									placeholder="e.g. 49000"
									value={newJournal.amount}
									onChange={(e) => setNewJournal(prev => ({ ...prev, amount: e.target.value }))}
									className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
								/>
							</div>

							<div className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-450 uppercase">Reference / Description</label>
								<input
									type="text"
									placeholder="e.g. Relocate operating imprest"
									value={newJournal.reference}
									onChange={(e) => setNewJournal(prev => ({ ...prev, reference: e.target.value }))}
									className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
								/>
							</div>

							<button
								type="submit"
								className="w-full py-2.5 mt-2 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-xl text-xs transition-all shadow-md active:scale-[0.99] border-none outline-none cursor-pointer"
							>
								Post Journal Entry
							</button>
						</form>
					</div>
				</div>
			)}

		</div>
	);
}
