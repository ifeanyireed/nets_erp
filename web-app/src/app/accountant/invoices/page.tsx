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
	IconTrash,
	IconPrinter,
	IconSparkles,
	IconX,
	IconCheck,
	IconFileText
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

interface LineItem {
	id: string;
	date: string;
	truckNo: string;
	location: string;
	trackingId: string;
	tonnage: string | number;
	amount: string | number;
}

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

function numberToWordsNaira(num: number): string {
	if (isNaN(num) || num <= 0) return "Zero Naira Only.";

	const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
		"Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
	const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

	function convertChunk(n: number): string {
		let str = "";
		if (n >= 100) {
			str += units[Math.floor(n / 100)] + " Hundred ";
			n %= 100;
		}
		if (n >= 20) {
			str += tens[Math.floor(n / 10)] + " ";
			n %= 10;
		}
		if (n > 0) {
			str += units[n] + " ";
		}
		return str.trim();
	}

	const nairaPart = Math.floor(num);
	const koboPart = Math.round((num - nairaPart) * 100);

	let words = "";
	if (nairaPart > 0) {
		const billion = Math.floor(nairaPart / 1000000000);
		const million = Math.floor((nairaPart % 1000000000) / 1000000);
		const thousand = Math.floor((nairaPart % 1000000) / 1000);
		const remainder = nairaPart % 1000;

		if (billion > 0) words += convertChunk(billion) + " Billion ";
		if (million > 0) words += convertChunk(million) + " Million ";
		if (thousand > 0) words += convertChunk(thousand) + " Thousand, ";
		if (remainder > 0) words += convertChunk(remainder) + " ";
		words = words.trim() + " Naira";
	}

	if (koboPart > 0) {
		const koboWords = convertChunk(koboPart);
		if (words) {
			words += ". " + koboWords + " Kobo Only.";
		} else {
			words = koboWords + " Kobo Only.";
		}
	} else {
		words += " Only.";
	}

	return words;
}

export default function InvoicesPage() {
	const router = useRouter();

	const [invoices, setInvoices] = useState<Invoice[]>([
		{ id: "inv-1", code: "NETS-CAP-2025-008", project: "Chemical Transport", clientName: "Chemical & Allied Products PLC", addedBy: "Oluwatobiloba Olateju", total: 513386.96, paid: 0.00, unpaid: 513386.96, invoiceDate: "15-08-2025", status: "Draft" },
		{ id: "inv-2", code: "NETS-ETS-2026-001", project: "Haulage Logistics", clientName: "Ecologique Transport Solution", addedBy: "Oluwatobiloba Olateju", total: 6000.00, paid: 0.00, unpaid: 6000.00, invoiceDate: "15-07-2026", status: "Draft" },
		{ id: "inv-3", code: "NETS-IHS-2026-002", project: "Tower Maintenance", clientName: "IHS - Holding Limited", addedBy: "Oluwatobiloba Olateju", total: 1000000.00, paid: 0.00, unpaid: 1000000.00, invoiceDate: "13-07-2026", status: "Draft" },
		{ id: "inv-4", code: "NETS-DUL-2026-003", project: "Paint Distribution", clientName: "Dulux - Chemical & Allied Product PLC", addedBy: "Oluwatobiloba Olateju", total: 2000.00, paid: 0.00, unpaid: 2000.00, invoiceDate: "13-07-2026", status: "Draft" },
		{ id: "inv-5", code: "NETS-7UP-2026-004", project: "Beverage Transit", clientName: "7UP Bottling Company", addedBy: "Oluwatobiloba Olateju", total: 6375.00, paid: 0.00, unpaid: 6375.00, invoiceDate: "13-07-2026", status: "Draft" },
		{ id: "inv-6", code: "NETS-NBC-2026-005", project: "Regional Supply", clientName: "Nigerian Bottling Company (NBC)", addedBy: "Queen Okonkwo", total: 5779200.00, paid: 0.00, unpaid: 5779200.00, invoiceDate: "10-07-2026", status: "Draft" }
	]);

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedClientFilter, setSelectedClientFilter] = useState("All");
	const [showAddModal, setShowAddModal] = useState(false);

	React.useEffect(() => {
		if (typeof window !== "undefined") {
			const params = new URLSearchParams(window.location.search);
			if (params.get("create") === "true") {
				setShowAddModal(true);
			}
		}
	}, []);

	// Invoice Document Form State
	const [invNumber, setInvNumber] = useState("NETS-CAP-2025-008");
	const [invDate, setInvDate] = useState("2025-08-15");
	const [coyRegNumber, setCoyRegNumber] = useState("RC. 463290");
	const [poNumber, setPoNumber] = useState("");
	const [bankers, setBankers] = useState("providus");
	const [accountName, setAccountName] = useState("New Era Transport Services");
	const [accountNumber, setAccountNumber] = useState("1304247018");
	const [tinNumber, setTinNumber] = useState("19300499-0001");
	const [billedToName, setBilledToName] = useState("CHEMICAL AND ALLIED PRODUCTS PLC");
	const [billedToAddress, setBilledToAddress] = useState("NO 2, ADENIYI JONES AVENUE, IKEJA LAGOS.");
	const [purposeOfInvoice, setPurposeOfInvoice] = useState("JULY 2025 INVOICE");
	const [salesRepId, setSalesRepId] = useState("");
	const [shippingMethod, setShippingMethod] = useState("Hand Delivery");
	const [dueDate, setDueDate] = useState("2025-08-30");

	const [lineItems, setLineItems] = useState<LineItem[]>([
		{ id: "1", date: "2025-07-11", truckNo: "MUS 07 YK", location: "IKEJA", trackingId: "16477", tonnage: 4880, amount: 28679.76 },
		{ id: "2", date: "2025-07-24", truckNo: "MUS 07 YK", location: "LEKKI", trackingId: "16644", tonnage: 6980, amount: 114402.20 },
		{ id: "3", date: "2025-07-25", truckNo: "MUS 07 YK", location: "GBAGADA", trackingId: "16656", tonnage: 4720, amount: 39581.92 },
		{ id: "4", date: "2025-07-29", truckNo: "MUS 07 YK", location: "IKEJA", trackingId: "16693", tonnage: 6920, amount: 40668.84 },
		{ id: "5", date: "2025-07-30", truckNo: "MUS 07 YK", location: "YABA", trackingId: "16715", tonnage: 5930, amount: 38865.22 },
		{ id: "6", date: "2025-07-31", truckNo: "MUS 07 YK", location: "ISOLO", trackingId: "16725", tonnage: 6300, amount: 64530.90 },
		{ id: "7", date: "2025-07-31", truckNo: "MUS 07 YK", location: "IBADAN", trackingId: "16744", tonnage: 5920, amount: 177209.28 }
	]);

	const [expenses, setExpenses] = useState<number | string>(377953.59);
	const [vatPercent, setVatPercent] = useState<number>(7.5);
	const [opCoordination, setOpCoordination] = useState("Operation Coordination");
	const [headOfFinance, setHeadOfFinance] = useState("Head of Finance");

	// Calculation logic
	const subtotal = lineItems.reduce((sum, item) => sum + (parseFloat(String(item.amount)) || 0), 0);
	const numExpenses = parseFloat(String(expenses)) || 0;
	const charge = Math.max(0, subtotal - numExpenses);
	const vatAmount = (charge * vatPercent) / 100;
	const grandTotal = subtotal + vatAmount;
	const amountInWords = numberToWordsNaira(grandTotal);

	const handleAddRow = () => {
		const newId = String(Date.now());
		setLineItems(prev => [
			...prev,
			{ id: newId, date: "", truckNo: "MUS 07 YK", location: "", trackingId: "", tonnage: "", amount: "" }
		]);
	};

	const handleRemoveRow = (id: string) => {
		if (lineItems.length <= 1) return;
		setLineItems(prev => prev.filter(item => item.id !== id));
	};

	const handleItemChange = (id: string, field: keyof LineItem, value: any) => {
		setLineItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
	};

	const loadSampleTemplate = () => {
		setInvNumber("NETS-CAP-2025-008");
		setInvDate("2025-08-15");
		setCoyRegNumber("RC. 463290");
		setPoNumber("PO-88204");
		setBankers("providus");
		setAccountName("New Era Transport Services");
		setAccountNumber("1304247018");
		setTinNumber("19300499-0001");
		setBilledToName("CHEMICAL AND ALLIED PRODUCTS PLC");
		setBilledToAddress("NO 2, ADENIYI JONES AVENUE, IKEJA LAGOS.");
		setPurposeOfInvoice("JULY 2025 INVOICE");
		setSalesRepId("SR-102");
		setShippingMethod("Hand Delivery");
		setDueDate("2025-08-30");

		setLineItems([
			{ id: "1", date: "2025-07-11", truckNo: "MUS 07 YK", location: "IKEJA", trackingId: "16477", tonnage: 4880, amount: 28679.76 },
			{ id: "2", date: "2025-07-24", truckNo: "MUS 07 YK", location: "LEKKI", trackingId: "16644", tonnage: 6980, amount: 114402.20 },
			{ id: "3", date: "2025-07-25", truckNo: "MUS 07 YK", location: "GBAGADA", trackingId: "16656", tonnage: 4720, amount: 39581.92 },
			{ id: "4", date: "2025-07-29", truckNo: "MUS 07 YK", location: "IKEJA", trackingId: "16693", tonnage: 6920, amount: 40668.84 },
			{ id: "5", date: "2025-07-30", truckNo: "MUS 07 YK", location: "YABA", trackingId: "16715", tonnage: 5930, amount: 38865.22 },
			{ id: "6", date: "2025-07-31", truckNo: "MUS 07 YK", location: "ISOLO", trackingId: "16725", tonnage: 6300, amount: 64530.90 },
			{ id: "7", date: "2025-07-31", truckNo: "MUS 07 YK", location: "IBADAN", trackingId: "16744", tonnage: 5920, amount: 177209.28 }
		]);
		setExpenses(377953.59);
		setVatPercent(7.5);
	};

	const filteredInvoices = invoices.filter(inv => {
		const matchesSearch = inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || inv.code.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesClient = selectedClientFilter === "All" || inv.clientName === selectedClientFilter;
		return matchesSearch && matchesClient;
	});

	const handleAddInvoiceSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const invData: Invoice = {
			id: `inv-${Date.now()}`,
			code: invNumber || `NETS-${Date.now().toString().slice(-4)}`,
			project: purposeOfInvoice || "Transport Logistics",
			clientName: billedToName || "Chemical & Allied Products PLC",
			addedBy: "Oluwatobiloba Olateju",
			total: grandTotal,
			paid: 0.00,
			unpaid: grandTotal,
			invoiceDate: invDate ? invDate.split("-").reverse().join("-") : "15-08-2025",
			status: "Draft"
		};
		setInvoices(prev => [invData, ...prev]);
		setShowAddModal(false);
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
					<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Duration</label>
					<input
						type="text"
						placeholder="Start Date To End Date"
						className="w-full px-3 py-2 bg-gray-50 border border-gray-250 text-xs rounded-xl focus:outline-none focus:border-blue-500 font-semibold"
					/>
				</div>

				<div className="md:col-span-3">
					<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Client</label>
					<select
						value={selectedClientFilter}
						onChange={(e) => setSelectedClientFilter(e.target.value)}
						className="w-full px-3 py-2 bg-gray-50 border border-gray-250 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-bold"
					>
						<option value="All">All clients</option>
						<option value="Chemical & Allied Products PLC">Chemical & Allied Products PLC</option>
						<option value="Ecologique Transport Solution">Ecologique Transport Solution</option>
						<option value="IHS - Holding Limited">IHS - Holding Limited</option>
						<option value="Dulux - Chemical & Allied Product PLC">Dulux PLC</option>
						<option value="7UP Bottling Company">7UP Bottling Company</option>
						<option value="Nigerian Bottling Company (NBC)">Nigerian Bottling Company (NBC)</option>
					</select>
				</div>

				<div className="md:col-span-4 relative mt-4 md:mt-0">
					<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Search</label>
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
							<th className="pb-3 min-w-[140px]">Code / Ref</th>
							<th className="pb-3 min-w-[130px]">Purpose</th>
							<th className="pb-3 min-w-[200px]">Client</th>
							<th className="pb-3 min-w-[150px]">Added By</th>
							<th className="pb-3 min-w-[150px]">Total Amount</th>
							<th className="pb-3 min-w-[110px]">Invoice Date</th>
							<th className="pb-3 min-w-[100px]">Status</th>
							<th className="pb-3 text-right w-16">Action</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-50">
						{filteredInvoices.length > 0 ? (
							filteredInvoices.map((inv) => (
								<tr key={inv.id} className="hover:bg-slate-50/50 transition-colors text-xs font-semibold text-slate-700">
									<td className="py-4 font-mono font-bold text-slate-800">{inv.code}</td>
									<td className="py-4 text-slate-600 font-medium">{inv.project}</td>
									<td className="py-4">
										<p className="font-extrabold text-blue-600 hover:underline cursor-pointer">{inv.clientName}</p>
										<p className="text-[10px] text-slate-450 mt-0.5">{inv.clientName.toLowerCase().replace(/[^a-z0-9]/g, "") + "@nets.com"}</p>
									</td>
									<td className="py-4 text-slate-600">{inv.addedBy}</td>
									<td className="py-4">
										<div className="flex flex-col gap-0.5">
											<p className="text-slate-900 font-extrabold">{formatNaira(inv.total)}</p>
											<p className="text-[10px] text-emerald-600">Paid: {formatNaira(inv.paid)}</p>
											<p className="text-[10px] text-red-500">Unpaid: {formatNaira(inv.unpaid)}</p>
										</div>
									</td>
									<td className="py-4 text-slate-550">{inv.invoiceDate}</td>
									<td className="py-4">
										<span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-full uppercase">
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
											<button className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors border-none bg-transparent">
												<IconDotsVertical className="w-4.5 h-4.5" />
											</button>
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={8} className="py-12 text-center text-xs text-slate-400 font-bold italic">
									No invoices found matching query.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* HIGH-FIDELITY DOCUMENT CREATE INVOICE MODAL */}
			{showAddModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-2 md:p-6 overflow-y-auto animate-fadeIn">
					<div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl border border-slate-200/80 flex flex-col my-auto max-h-[92vh] overflow-hidden animate-slideUp">
						
						{/* Top Modal Navigation Header */}
						<div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-900 text-white shrink-0">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">
									<IconFileText className="w-5 h-5" />
								</div>
								<div>
									<h3 className="font-extrabold text-white text-base tracking-tight flex items-center gap-2">
										Create Official Invoice Document
										<span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-md uppercase tracking-wider">NETS Standard</span>
									</h3>
									<p className="text-[11px] text-slate-400 font-medium">Tailored transport & haulage billing template</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<button
									type="button"
									onClick={loadSampleTemplate}
									className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
									title="Populate fields with reference document values"
								>
									<IconSparkles className="w-3.5 h-3.5 text-amber-400" />
									Load Image Preset Data
								</button>
								<button
									type="button"
									onClick={() => setShowAddModal(false)}
									className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-bold border-none"
								>
									<IconX className="w-4 h-4" />
								</button>
							</div>
						</div>

						{/* Paper Invoice Sheet Canvas Scroll Area */}
						<div className="overflow-y-auto p-4 md:p-8 bg-slate-100 flex justify-center">
							<form 
								id="invoice-document-form" 
								onSubmit={handleAddInvoiceSubmit}
								className="w-full max-w-4xl bg-white rounded-lg shadow-xl border border-slate-300 p-6 md:p-10 font-sans text-slate-900 text-xs flex flex-col gap-6"
							>
								{/* INVOICE PAPER HEADER */}
								<div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-slate-900 pb-5 gap-4">
									<div className="flex flex-col">
										<div className="flex items-center gap-3">
											<img 
												src="/favicon.png" 
												alt="NEW ERA Logo" 
												className="w-12 h-12 object-contain rounded-xl p-1 border border-slate-200 bg-white shadow-xs shrink-0" 
											/>
											<div>
												<h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 uppercase">
													NEW ERA
												</h1>
												<p className="text-[10px] font-extrabold tracking-widest text-slate-600 uppercase">
													TRANSPORT SERVICES
												</p>
											</div>
										</div>
									</div>

									<div className="text-left md:text-right border-l-2 md:border-l-0 md:border-r-0 border-red-500 pl-3 md:pl-0">
										<p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">SERVICES</p>
										<p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">
											HAULAGE | INTRA CITY TRANSPORT | LEASING | FLEET MANAGEMENT
										</p>
									</div>
								</div>

								{/* HEADER GRID METADATA (Boxed Paper Form Style) */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-800 border border-slate-800 rounded-sm overflow-hidden text-slate-900">
									
									{/* Left Column Box */}
									<div className="bg-white p-3 flex flex-col gap-2">
										<div className="grid grid-cols-12 items-center gap-2">
											<span className="col-span-5 text-[10px] font-black uppercase text-slate-700">INVOICE NUMBER</span>
											<div className="col-span-7">
												<input
													type="text"
													required
													value={invNumber}
													onChange={(e) => setInvNumber(e.target.value)}
													className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:bg-amber-50/50 outline-none"
												/>
											</div>
										</div>

										<div className="grid grid-cols-12 items-center gap-2">
											<span className="col-span-5 text-[10px] font-black uppercase text-slate-700">INVOICE DATE</span>
											<div className="col-span-7">
												<input
													type="date"
													required
													value={invDate}
													onChange={(e) => setInvDate(e.target.value)}
													className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:bg-amber-50/50 outline-none"
												/>
											</div>
										</div>

										<div className="grid grid-cols-12 items-center gap-2">
											<span className="col-span-5 text-[10px] font-black uppercase text-slate-700">COY REG NUMBER</span>
											<div className="col-span-7">
												<input
													type="text"
													value={coyRegNumber}
													onChange={(e) => setCoyRegNumber(e.target.value)}
													className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:bg-amber-50/50 outline-none"
												/>
											</div>
										</div>

										<div className="grid grid-cols-12 items-center gap-2">
											<span className="col-span-5 text-[10px] font-black uppercase text-slate-700">PO NUMBER</span>
											<div className="col-span-7">
												<input
													type="text"
													placeholder="e.g. PO-88204"
													value={poNumber}
													onChange={(e) => setPoNumber(e.target.value)}
													className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:bg-amber-50/50 outline-none"
												/>
											</div>
										</div>
									</div>

									{/* Right Column Box (Bank Details & TIN) */}
									<div className="bg-white p-3 flex flex-col gap-2">
										<div className="grid grid-cols-12 items-center gap-2">
											<span className="col-span-5 text-[10px] font-black uppercase text-slate-700">BANKERS</span>
											<div className="col-span-7">
												<input
													type="text"
													value={bankers}
													onChange={(e) => setBankers(e.target.value)}
													className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:bg-amber-50/50 outline-none"
												/>
											</div>
										</div>

										<div className="grid grid-cols-12 items-center gap-2">
											<span className="col-span-5 text-[10px] font-black uppercase text-slate-700">ACCOUNT NAME</span>
											<div className="col-span-7">
												<input
													type="text"
													value={accountName}
													onChange={(e) => setAccountName(e.target.value)}
													className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:bg-amber-50/50 outline-none"
												/>
											</div>
										</div>

										<div className="grid grid-cols-12 items-center gap-2">
											<span className="col-span-5 text-[10px] font-black uppercase text-slate-700">ACCOUNT NUMBER</span>
											<div className="col-span-7">
												<input
													type="text"
													value={accountNumber}
													onChange={(e) => setAccountNumber(e.target.value)}
													className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:bg-amber-50/50 outline-none"
												/>
											</div>
										</div>

										<div className="grid grid-cols-12 items-center gap-2">
											<span className="col-span-5 text-[10px] font-black uppercase text-slate-700">TIN</span>
											<div className="col-span-7">
												<input
													type="text"
													value={tinNumber}
													onChange={(e) => setTinNumber(e.target.value)}
													className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-mono font-semibold text-slate-900 focus:bg-amber-50/50 outline-none"
												/>
											</div>
										</div>
									</div>
								</div>

								{/* BILLED TO SECTION */}
								<div className="border border-slate-800 rounded-sm p-3 bg-slate-50/80 flex flex-col gap-2">
									<div className="grid grid-cols-12 items-start gap-2">
										<span className="col-span-12 md:col-span-2 text-[10px] font-black uppercase text-slate-800 pt-1">BILLED TO</span>
										<div className="col-span-12 md:col-span-10 flex flex-col gap-2">
											<input
												type="text"
												required
												placeholder="Client Company Name"
												value={billedToName}
												onChange={(e) => setBilledToName(e.target.value)}
												className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-extrabold text-slate-900 uppercase focus:bg-amber-50/50 outline-none"
											/>
											<input
												type="text"
												placeholder="Client Office Address"
												value={billedToAddress}
												onChange={(e) => setBilledToAddress(e.target.value)}
												className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-medium text-slate-800 uppercase focus:bg-amber-50/50 outline-none"
											/>
										</div>
									</div>
								</div>

								{/* PURPOSE OF INVOICE & LOGISTICS METADATA BAR */}
								<div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-slate-800 border border-slate-800 rounded-sm overflow-hidden text-slate-900">
									<div className="bg-white p-2.5 flex flex-col gap-1">
										<label className="text-[9px] font-black uppercase text-slate-600">PURPOSE OF INVOICE</label>
										<input
											type="text"
											required
											value={purposeOfInvoice}
											onChange={(e) => setPurposeOfInvoice(e.target.value)}
											className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-bold text-slate-900 uppercase focus:bg-amber-50/50 outline-none"
										/>
									</div>
									<div className="bg-white p-2.5 flex flex-col gap-1">
										<label className="text-[9px] font-black uppercase text-slate-600">SALES REP ID</label>
										<input
											type="text"
											placeholder="Optional Rep ID"
											value={salesRepId}
											onChange={(e) => setSalesRepId(e.target.value)}
											className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-semibold text-slate-900 uppercase focus:bg-amber-50/50 outline-none"
										/>
									</div>
									<div className="bg-white p-2.5 flex flex-col gap-1">
										<label className="text-[9px] font-black uppercase text-slate-600">SHIPPING METHOD</label>
										<input
											type="text"
											value={shippingMethod}
											onChange={(e) => setShippingMethod(e.target.value)}
											className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-semibold text-slate-900 uppercase focus:bg-amber-50/50 outline-none"
										/>
									</div>
									<div className="bg-white p-2.5 flex flex-col gap-1">
										<label className="text-[9px] font-black uppercase text-slate-600">DUE DATE</label>
										<input
											type="date"
											value={dueDate}
											onChange={(e) => setDueDate(e.target.value)}
											className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:bg-amber-50/50 outline-none"
										/>
									</div>
								</div>

								{/* TRANSPORTATION LINE ITEMS TABLE */}
								<div className="flex flex-col gap-2">
									<div className="flex justify-between items-center">
										<h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Haulage & Delivery Line Items</h4>
										<button
											type="button"
											onClick={handleAddRow}
											className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
										>
											<IconPlus className="w-3.5 h-3.5" />
											Add Line Item
										</button>
									</div>

									<div className="overflow-x-auto border border-slate-900 rounded-sm">
										<table className="w-full text-left border-collapse border border-slate-900">
											<thead>
												<tr className="bg-slate-100 border-b border-slate-900 text-[10px] font-black text-slate-900 uppercase tracking-tight text-center">
													<th className="p-2 border-r border-slate-900 w-12">S/No</th>
													<th className="p-2 border-r border-slate-900 min-w-[110px]">DATE</th>
													<th className="p-2 border-r border-slate-900 min-w-[120px]">TRUCK NO</th>
													<th className="p-2 border-r border-slate-900 min-w-[120px]">LOCATION</th>
													<th className="p-2 border-r border-slate-900 min-w-[110px]">TRACKING ID</th>
													<th className="p-2 border-r border-slate-900 min-w-[100px]">TONNAGE</th>
													<th className="p-2 border-r border-slate-900 min-w-[130px]">AMOUNT (₦)</th>
													<th className="p-1 w-8"></th>
												</tr>
											</thead>
											<tbody className="divide-y divide-slate-900 text-xs">
												{lineItems.map((item, idx) => (
													<tr key={item.id} className="hover:bg-amber-50/30">
														<td className="p-2 text-center font-bold border-r border-slate-900 bg-slate-50">{idx + 1}</td>
														<td className="p-1 border-r border-slate-900">
															<input
																type="date"
																value={item.date}
																onChange={(e) => handleItemChange(item.id, "date", e.target.value)}
																className="w-full px-1.5 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-slate-800 rounded font-medium focus:bg-white outline-none"
															/>
														</td>
														<td className="p-1 border-r border-slate-900">
															<input
																type="text"
																placeholder="e.g. MUS 07 YK"
																value={item.truckNo}
																onChange={(e) => handleItemChange(item.id, "truckNo", e.target.value)}
																className="w-full px-1.5 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-slate-800 rounded font-bold uppercase focus:bg-white outline-none"
															/>
														</td>
														<td className="p-1 border-r border-slate-900">
															<input
																type="text"
																placeholder="Location"
																value={item.location}
																onChange={(e) => handleItemChange(item.id, "location", e.target.value)}
																className="w-full px-1.5 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-slate-800 rounded font-semibold uppercase focus:bg-white outline-none"
															/>
														</td>
														<td className="p-1 border-r border-slate-900">
															<input
																type="text"
																placeholder="Waybill/ID"
																value={item.trackingId}
																onChange={(e) => handleItemChange(item.id, "trackingId", e.target.value)}
																className="w-full px-1.5 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-slate-800 rounded font-mono font-medium text-center focus:bg-white outline-none"
															/>
														</td>
														<td className="p-1 border-r border-slate-900">
															<input
																type="number"
																placeholder="0"
																value={item.tonnage}
																onChange={(e) => handleItemChange(item.id, "tonnage", e.target.value)}
																className="w-full px-1.5 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-slate-800 rounded font-mono font-semibold text-right focus:bg-white outline-none"
															/>
														</td>
														<td className="p-1 border-r border-slate-900">
															<input
																type="number"
																step="0.01"
																placeholder="0.00"
																value={item.amount}
																onChange={(e) => handleItemChange(item.id, "amount", e.target.value)}
																className="w-full px-1.5 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-slate-800 rounded font-mono font-bold text-right focus:bg-white outline-none"
															/>
														</td>
														<td className="p-1 text-center">
															{lineItems.length > 1 && (
																<button
																	type="button"
																	onClick={() => handleRemoveRow(item.id)}
																	className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded border-none bg-transparent cursor-pointer"
																	title="Delete Row"
																>
																	<IconTrash className="w-3.5 h-3.5" />
																</button>
															)}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>

								{/* SUMMARY & FINANCIAL BREAKDOWN BOX */}
								<div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-2">
									
									{/* Left Column: Notes & Amount in Words */}
									<div className="md:col-span-6 flex flex-col gap-3">
										<div className="border border-slate-900 rounded-sm p-3 bg-amber-50/40">
											<span className="text-[10px] font-black uppercase text-slate-800 block mb-1">AMOUNT IN WORDS</span>
											<p className="text-xs font-bold italic text-slate-900 leading-snug">
												{amountInWords}
											</p>
										</div>

										<div className="text-[10px] text-slate-500 leading-normal italic">
											* All transport services subject to standard New Era Transport terms.
										</div>
									</div>

									{/* Right Column: Financial Calculations Grid (Matching Image Totals) */}
									<div className="md:col-span-6 border border-slate-900 rounded-sm overflow-hidden text-xs">
										<div className="flex justify-between items-center p-2.5 border-b border-slate-900 bg-slate-50">
											<span className="font-black uppercase text-slate-800 text-[10px]">LINE ITEMS TOTAL</span>
											<span className="font-mono font-bold text-slate-900 text-xs">{formatNaira(subtotal)}</span>
										</div>

										<div className="flex justify-between items-center p-2 border-b border-slate-900 bg-white">
											<span className="font-extrabold uppercase text-slate-700 text-[10px]">EXPENSES</span>
											<div className="flex items-center gap-1">
												<span className="text-slate-400 font-mono text-[11px]">₦</span>
												<input
													type="number"
													step="0.01"
													value={expenses}
													onChange={(e) => setExpenses(e.target.value)}
													className="w-32 px-2 py-0.5 border border-slate-300 rounded font-mono font-semibold text-right text-xs focus:bg-amber-50/50 outline-none"
												/>
											</div>
										</div>

										<div className="flex justify-between items-center p-2.5 border-b border-slate-900 bg-slate-50">
											<span className="font-black uppercase text-slate-800 text-[10px]">CHARGE</span>
											<span className="font-mono font-bold text-slate-900 text-xs">{formatNaira(charge)}</span>
										</div>

										<div className="flex justify-between items-center p-2 border-b border-slate-900 bg-white">
											<div className="flex items-center gap-2">
												<span className="font-extrabold uppercase text-slate-700 text-[10px]">VAT (%)</span>
												<input
													type="number"
													step="0.1"
													value={vatPercent}
													onChange={(e) => setVatPercent(parseFloat(e.target.value) || 0)}
													className="w-14 px-1 py-0.5 border border-slate-300 rounded font-mono font-semibold text-center text-xs focus:bg-amber-50/50 outline-none"
												/>
											</div>
											<span className="font-mono font-semibold text-slate-800">{formatNaira(vatAmount)}</span>
										</div>

										<div className="flex justify-between items-center p-3 bg-slate-900 text-white">
											<span className="font-black uppercase tracking-wider text-xs">GRAND TOTAL</span>
											<span className="font-mono font-black text-sm text-emerald-400">{formatNaira(grandTotal)}</span>
										</div>
									</div>
								</div>

								{/* SIGNATURE / AUTHORIZATION FOOTER */}
								<div className="grid grid-cols-2 gap-8 pt-8 mt-4 border-t border-slate-300">
									<div className="flex flex-col items-center gap-2 text-center">
										<div className="w-48 h-12 border-b border-dashed border-slate-400 flex items-end justify-center pb-1">
											<span className="font-serif italic text-slate-400 text-sm">OpCoord Approval</span>
										</div>
										<input
											type="text"
											value={opCoordination}
											onChange={(e) => setOpCoordination(e.target.value)}
											className="text-center font-extrabold text-xs text-slate-800 uppercase border-b border-transparent focus:border-slate-400 outline-none bg-transparent"
										/>
									</div>

									<div className="flex flex-col items-center gap-2 text-center">
										<div className="w-48 h-12 border-b border-dashed border-slate-400 flex items-end justify-center pb-1">
											<span className="font-serif italic text-slate-400 text-sm">Finance Approval</span>
										</div>
										<input
											type="text"
											value={headOfFinance}
											onChange={(e) => setHeadOfFinance(e.target.value)}
											className="text-center font-extrabold text-xs text-slate-800 uppercase border-b border-transparent focus:border-slate-400 outline-none bg-transparent"
										/>
									</div>
								</div>

							</form>
						</div>

						{/* Modal Bottom Actions Bar */}
						<div className="flex justify-between items-center px-6 py-4 border-t border-slate-200 bg-white shrink-0">
							<div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
								<span>Grand Total:</span>
								<span className="text-slate-900 font-black text-sm">{formatNaira(grandTotal)}</span>
							</div>

							<div className="flex items-center gap-3">
								<button
									type="button"
									onClick={() => window.print()}
									className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
								>
									<IconPrinter className="w-4 h-4" />
									Print Preview
								</button>
								<button
									type="button"
									onClick={() => setShowAddModal(false)}
									className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
								>
									Cancel
								</button>
								<button
									type="submit"
									form="invoice-document-form"
									className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer border-none"
								>
									<IconCheck className="w-4 h-4" />
									Generate & Save Invoice
								</button>
							</div>
						</div>

					</div>
				</div>
			)}

		</div>
	);
}

