"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SubNavTabs from "@/components/nets_erp/SubNavTabs";
import { 
	IconPlus, 
	IconDownload, 
	IconSearch,
	IconRefresh,
	IconClock,
	IconFilter,
	IconDotsVertical,
	IconTrash
} from "@tabler/icons-react";

const CLIENTS_TABS = [
	{ id: "clients", label: "Clients", slug: "/accountant/clients" },
	{ id: "proposals", label: "Proposals", slug: "/accountant/proposals" },
	{ id: "estimates", label: "Estimates", slug: "/accountant/estimates" },
	{ id: "orders", label: "Orders", slug: "/accountant/orders" },
	{ id: "invoices", label: "Invoices", slug: "/accountant/invoices" },
	{ id: "payments", label: "Payments", slug: "/accountant/payments" },
	{ id: "credit-notes", label: "Credit Notes", slug: "/accountant/credit-notes" },
	{ id: "retainers", label: "Retainers", slug: "/accountant/retainers" }
];

interface Invoice {
	id: string;
	code: string;
	project: string;
	clientName: string;
	addedBy: string;
	total: number;
	paid: number;
	unpaid: number;
	invoiceDate: string;
	status: string;
}

export default function InvoicesPage() {
	const router = useRouter();

	const [invoices, setInvoices] = useState<Invoice[]>([
		{ id: "inv-1", code: "--", project: "--", clientName: "Ecologique Transport Solution", addedBy: "Oluwatobiloba Olateju", total: 6000.00, paid: 0.00, unpaid: 6000.00, invoiceDate: "15-07-2026", status: "Draft" },
		{ id: "inv-2", code: "--", project: "--", clientName: "IHS - Holding Limited", addedBy: "Oluwatobiloba Olateju", total: 0.00, paid: 0.00, unpaid: 0.00, invoiceDate: "13-07-2026", status: "Draft" },
		{ id: "inv-3", code: "--", project: "--", clientName: "IHS - Holding Limited", addedBy: "Oluwatobiloba Olateju", total: 0.00, paid: 0.00, unpaid: 0.00, invoiceDate: "13-07-2026", status: "Draft" },
		{ id: "inv-4", code: "--", project: "--", clientName: "IHS - Holding Limited", addedBy: "Oluwatobiloba Olateju", total: 0.00, paid: 0.00, unpaid: 0.00, invoiceDate: "13-07-2026", status: "Draft" },
		{ id: "inv-5", code: "--", project: "--", clientName: "IHS - Holding Limited", addedBy: "Oluwatobiloba Olateju", total: 1000000.00, paid: 0.00, unpaid: 1000000.00, invoiceDate: "13-07-2026", status: "Draft" },
		{ id: "inv-6", code: "--", project: "--", clientName: "Dulux - Chemical & Allied Product PLC", addedBy: "Oluwatobiloba Olateju", total: 2000.00, paid: 0.00, unpaid: 2000.00, invoiceDate: "13-07-2026", status: "Draft" },
		{ id: "inv-7", code: "--", project: "--", clientName: "7UP Bottling Company", addedBy: "Oluwatobiloba Olateju", total: 6375.00, paid: 0.00, unpaid: 6375.00, invoiceDate: "13-07-2026", status: "Draft" },
		{ id: "inv-8", code: "--", project: "--", clientName: "Nigerian Bottling Company (NBC)", addedBy: "Queen Okonkwo", total: 5779200.00, paid: 0.00, unpaid: 5779200.00, invoiceDate: "10-07-2026", status: "Draft" },
		{ id: "inv-9", code: "--", project: "--", clientName: "Ecologique Transport Solution", addedBy: "Oluwatobiloba Olateju", total: 449962.50, paid: 0.00, unpaid: 449962.50, invoiceDate: "06-07-2026", status: "Draft" },
		{ id: "inv-10", code: "--", project: "--", clientName: "7UP Bottling Company", addedBy: "Oluwatobiloba Olateju", total: 100000.00, paid: 0.00, unpaid: 100000.00, invoiceDate: "25-06-2026", status: "Draft" }
	]);

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedClientFilter, setSelectedClientFilter] = useState("All");
	const [showAddModal, setShowAddModal] = useState(false);

	const [newInvoice, setNewInvoice] = useState({
		clientName: "Ecologique Transport Solution",
		total: "",
		invoiceDate: ""
	});

	const filteredInvoices = invoices.filter(inv => {
		const matchesSearch = inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || inv.id.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesClient = selectedClientFilter === "All" || inv.clientName === selectedClientFilter;
		return matchesSearch && matchesClient;
	});

	const handleAddInvoiceSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const total = parseFloat(newInvoice.total) || 0;
		const padNum = String(invoices.length + 1).padStart(3, "0");
		const invData: Invoice = {
			id: `inv-${Date.now()}`,
			code: "--",
			project: "--",
			clientName: newInvoice.clientName,
			addedBy: "Oluwatobiloba Olateju",
			total: total,
			paid: 0.00,
			unpaid: total,
			invoiceDate: newInvoice.invoiceDate.split("-").reverse().join("-"),
			status: "Draft"
		};
		setInvoices(prev => [invData, ...prev]);
		setShowAddModal(false);
		setNewInvoice({ clientName: "Ecologique Transport Solution", total: "", invoiceDate: "" });
	};

	const handleDeleteInvoice = (id: string) => {
		if (confirm("Are you sure you want to delete this invoice?")) {
			setInvoices(prev => prev.filter(i => i.id !== id));
		}
	};

	const formatNaira = (amount: number) => {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			minimumFractionDigits: 2
		}).format(amount);
	};

	return (
		<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/40 flex flex-col gap-6 animate-fadeIn text-[#1e293b]">
			
			{/* Top Filters Block */}
			<div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pb-4 border-b border-gray-50">
				<div className="md:col-span-3">
					<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Duration</label>
					<input
						type="text"
						placeholder="Start Date To End Date"
						className="w-full px-3 py-2 bg-gray-50 border border-gray-250 text-xs rounded-xl focus:outline-none focus:border-blue-500 font-semibold"
					/>
				</div>

				<div className="md:col-span-3">
					<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Client</label>
					<select
						value={selectedClientFilter}
						onChange={(e) => setSelectedClientFilter(e.target.value)}
						className="w-full px-3 py-2 bg-gray-50 border border-gray-250 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-bold"
					>
						<option value="All">All clients</option>
						<option value="Ecologique Transport Solution">Ecologique Transport Solution</option>
						<option value="IHS - Holding Limited">IHS - Holding Limited</option>
						<option value="Dulux - Chemical & Allied Product PLC">Dulux PLC</option>
						<option value="7UP Bottling Company">7UP Bottling Company</option>
						<option value="Nigerian Bottling Company (NBC)">Nigerian Bottling Company (NBC)</option>
					</select>
				</div>

				<div className="md:col-span-4 relative mt-4 md:mt-0">
					<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Search</label>
					<div className="relative">
						<input
							type="text"
							placeholder="Start typing to search"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold outline-none"
						/>
						<IconSearch className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
					</div>
				</div>

				<div className="md:col-span-2 pt-5">
					<button
						onClick={() => alert("Apply filters...")}
						className="w-full py-2 bg-white hover:bg-slate-50 border border-gray-200 text-slate-700 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
					>
						<IconFilter className="w-3.5 h-3.5" />
						Filters
					</button>
				</div>
			</div>

			{/* Sub-menu Tabs */}
			<div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide gap-1">
				<SubNavTabs tabs={CLIENTS_TABS} activeTabId="invoices" colorTheme="red" />
			</div>

			{/* Table Actions Row */}
			<div className="flex items-center gap-2 flex-wrap">
				<button
					onClick={() => setShowAddModal(true)}
					className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all border-none outline-none"
				>
					<IconPlus className="w-4 h-4" />
					Create Invoice
				</button>
				<button
					onClick={() => alert("Recurring invoices configuration...")}
					className="px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-650 hover:text-slate-800 font-extrabold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all"
				>
					<IconRefresh className="w-4 h-4 text-slate-400" />
					Recurring Invoice
				</button>
				<button
					onClick={() => alert("Time log invoice log options...")}
					className="px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-650 hover:text-slate-800 font-extrabold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all"
				>
					<IconClock className="w-4 h-4 text-slate-400" />
					Create Time Log Invoice
				</button>
				<button
					onClick={() => alert("Export invoices list...")}
					className="px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-655 hover:text-slate-850 font-extrabold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all"
				>
					<IconDownload className="w-4 h-4 text-slate-400" />
					Export
				</button>
			</div>

			{/* Table Grid */}
			<div className="overflow-x-auto min-h-[400px]">
				<table className="w-full text-left border-collapse select-none">
					<thead>
						<tr className="border-b border-gray-100 text-slate-455 text-[11px] font-bold uppercase tracking-wider">
							<th className="pb-3 min-w-[70px]">Code</th>
							<th className="pb-3 min-w-[120px]">Invoice</th>
							<th className="pb-3 min-w-[80px]">Project</th>
							<th className="pb-3 min-w-[200px]">Client</th>
							<th className="pb-3 min-w-[150px]">Added By</th>
							<th className="pb-3 min-w-[150px]">Total</th>
							<th className="pb-3 min-w-[110px]">Invoice Date</th>
							<th className="pb-3 min-w-[100px]">Status</th>
							<th className="pb-3 text-right w-16">Action</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-50">
						{filteredInvoices.length > 0 ? (
							filteredInvoices.map((inv, idx) => (
								<tr key={inv.id} className="hover:bg-slate-50/50 transition-colors text-xs font-semibold text-slate-700">
									<td className="py-4 text-slate-400 font-mono">{inv.code}</td>
									<td className="py-4 font-bold text-slate-800">
										{`NET-${inv.clientName.slice(0, 3).toUpperCase()}-${idx + 10}`}
									</td>
									<td className="py-4 text-slate-400 font-mono">{inv.project}</td>
									<td className="py-4">
										<p className="font-extrabold text-blue-600 hover:underline cursor-pointer">{inv.clientName}</p>
										<p className="text-[10px] text-slate-450 mt-0.5">{inv.clientName.toLowerCase().replace(/ /g, "") + "@nets.com"}</p>
									</td>
									<td className="py-4 text-slate-600">{inv.addedBy}</td>
									<td className="py-4">
										<div className="flex flex-col gap-0.5">
											<p className="text-slate-800 font-bold">Total: {formatNaira(inv.total)}</p>
											<p className="text-[10px] text-emerald-600">Paid: {formatNaira(inv.paid)}</p>
											<p className="text-[10px] text-red-500">Unpaid: {formatNaira(inv.unpaid)}</p>
										</div>
									</td>
									<td className="py-4 text-slate-550">{inv.invoiceDate}</td>
									<td className="py-4">
										<span className="flex items-center gap-1.5 text-blue-600 font-bold text-[10px] uppercase">
											<span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
											{inv.status}
										</span>
									</td>
									<td className="py-4 text-right">
										<div className="flex justify-end gap-1">
											<button 
												onClick={() => handleDeleteInvoice(inv.id)}
												className="p-1 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg cursor-pointer transition-colors border-none bg-transparent"
												title="Delete Invoice"
											>
												<IconTrash className="w-4 h-4" />
											</button>
											<button className="p-1 hover:bg-slate-105 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors border-none bg-transparent">
												<IconDotsVertical className="w-4.5 h-4.5" />
											</button>
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={9} className="py-12 text-center text-xs text-slate-400 font-bold italic">
									No invoices found matching query.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* ADD INVOICE MODAL */}
			{showAddModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
					<div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-slideUp">
						<div className="flex justify-between items-center p-6 border-b border-gray-100 bg-slate-50/50">
							<div>
								<h3 className="font-extrabold text-slate-800 text-sm">Create Customer Invoice</h3>
								<p className="text-[10px] text-slate-455 mt-0.5 font-semibold">Generate new aged receivable billing log</p>
							</div>
							<button
								onClick={() => setShowAddModal(false)}
								className="w-7 h-7 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-sm font-bold border-none bg-transparent"
							>
								✕
							</button>
						</div>

						<form onSubmit={handleAddInvoiceSubmit} className="p-6 flex flex-col gap-4 text-left">
							<div className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-450 uppercase">Client</label>
								<select
									value={newInvoice.clientName}
									onChange={(e) => setNewInvoice(prev => ({ ...prev, clientName: e.target.value }))}
									className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
								>
									<option value="Ecologique Transport Solution">Ecologique Transport Solution</option>
									<option value="IHS - Holding Limited">IHS - Holding Limited</option>
									<option value="Dulux - Chemical & Allied Product PLC">Dulux PLC</option>
									<option value="7UP Bottling Company">7UP Bottling Company</option>
									<option value="Nigerian Bottling Company (NBC)">Nigerian Bottling Company (NBC)</option>
								</select>
							</div>

							<div className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-455 uppercase">Invoice Date</label>
								<input
									type="date"
									required
									value={newInvoice.invoiceDate}
									onChange={(e) => setNewInvoice(prev => ({ ...prev, invoiceDate: e.target.value }))}
									className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
								/>
							</div>

							<div className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-455 uppercase">Amount (NGN)</label>
								<input
									type="number"
									required
									placeholder="e.g. 150000"
									value={newInvoice.total}
									onChange={(e) => setNewInvoice(prev => ({ ...prev, total: e.target.value }))}
									className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
								/>
							</div>

							<button
								type="submit"
								className="w-full py-2.5 mt-2 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-xl text-xs transition-all shadow-md active:scale-[0.99] border-none outline-none cursor-pointer"
							>
								Generate Invoice
							</button>
						</form>
					</div>
				</div>
			)}

		</div>
	);
}
