"use client";

import React, { useState } from "react";
import { useERPStore, User, Role, DEPARTMENTS } from "@/lib/erp-store";
import ERPLayout from "@/components/nets_erp/Layout";

export default function UserRoleManagement() {
  const { users, updateUsers } = useERPStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Fleet 1 (Driver)");
  const [role, setRole] = useState<Role>("employee");
  const [managerName, setManagerName] = useState("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editDept, setEditDept] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleDeptChange = (val: string) => {
    setSelectedDept(val);
    setCurrentPage(1);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Please provide employee details.");
      return;
    }

    const managers = users.filter(u => u.role === "manager" || u.role === "hr" || u.role === "md");
    const defaultManager = managers.length > 0 ? managers[0].name : "Robert Vance";

    const newUser: User = {
      id: `${role === "employee" ? "EMP" : role === "manager" ? "MGR" : role.toUpperCase()}00${users.length + 1}`,
      name,
      email,
      role,
      department,
      avatar: `/character${Math.floor(Math.random() * 9) + 1}.jpg`,
      managerName: role === "employee" ? managerName || defaultManager : undefined,
    };

    const updated = [...users, newUser];
    updateUsers(updated);
    setName("");
    setEmail("");
    setManagerName("");
    alert("User account provisioned successfully!");
  };

  const handleDelete = (id: string) => {
    const updated = users.filter(u => u.id !== id);
    updateUsers(updated);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.designation && u.designation.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = selectedDept === "All" || u.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <ERPLayout>
      <div className="flex flex-col gap-6">
        
        {/* Header */}
        <div>
          <h2 className="text-[20px] font-black text-slate-800 tracking-tight">User & Role Management</h2>
          <p className="text-xs text-slate-450 font-semibold mt-1">Audit employee roster permissions and reporting hierarchy</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Roster list (7cols) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 lg:col-span-7 flex flex-col gap-4">
            <h3 className="font-bold text-slate-855 text-sm pb-2 border-b border-gray-100">ERP User Accounts</h3>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mt-1">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name, ID, designation..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-semibold text-slate-700 placeholder-slate-400"
                />
              </div>
              <div className="w-full sm:w-44">
                <select
                  value={selectedDept}
                  onChange={(e) => handleDeptChange(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-bold text-slate-700"
                >
                  <option value="All">All Departments</option>
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-3">
              {paginatedUsers.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-semibold bg-gray-50/50 rounded-xl border border-dashed">
                  No matching user accounts found.
                </div>
              ) : (
                paginatedUsers.map((u) => (
                <div key={u.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-150/40">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border" />
                    <div>
                      <p className="font-bold text-slate-700 text-xs">{u.name}</p>
                      {editingUserId === u.id ? (
                        <div className="flex items-center gap-2 mt-1">
                          <select
                            value={editDept}
                            onChange={(e) => setEditDept(e.target.value)}
                            className="pl-2 pr-6 py-0.5 bg-white border border-gray-250 rounded-md text-[10px] font-bold text-slate-700"
                          >
                            {DEPARTMENTS.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => {
                              const updated = users.map(user => user.id === u.id ? { ...user, department: editDept } : user);
                              updateUsers(updated);
                              setEditingUserId(null);
                            }}
                            className="bg-blue-600 hover:bg-blue-750 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="text-slate-400 hover:text-slate-650 text-[9px] font-extrabold px-1.5 py-0.5"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">
                          ID: {u.id} • {u.role} • {u.department}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingUserId !== u.id && (
                      <button
                        onClick={() => {
                          setEditingUserId(u.id);
                          setEditDept(u.department);
                        }}
                        className="text-blue-600 hover:text-blue-750 text-xs font-bold mr-2"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-red-500 hover:text-red-750 text-xs font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
              )}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 mt-4">
                <p className="text-[11px] text-slate-450 font-bold">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                </p>
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-slate-700 disabled:opacity-40 disabled:hover:bg-gray-50 rounded-xl text-[10px] font-extrabold transition-all"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Only show first page, last page, and pages around current page to avoid clutter
                    const shouldShow = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                    if (!shouldShow) {
                      // If adjacent to visible pages, show ellipsis
                      if (page === 2 || page === totalPages - 1) {
                        return <span key={`dots-${page}`} className="text-[10px] text-slate-400 font-bold px-1">...</span>;
                      }
                      return null;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-extrabold transition-all ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white border border-gray-200 text-slate-600 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-slate-700 disabled:opacity-40 disabled:hover:bg-gray-50 rounded-xl text-[10px] font-extrabold transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Provisioning form (5cols) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 lg:col-span-5">
            <h3 className="font-bold text-slate-855 text-sm pb-2 border-b border-gray-100 mb-4">Provision Employee Account</h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-450 uppercase mb-1.5 tracking-wider">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Michael Scott"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-455 uppercase mb-1.5 tracking-wider">Corporate Email</label>
                <input
                  type="email"
                  placeholder="e.g. michael.scott@portalflow.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-450 uppercase mb-1.5 tracking-wider">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-bold"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-455 uppercase mb-1.5 tracking-wider">Access Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full pl-3 pr-10 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-bold"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Line Manager</option>
                    <option value="hr">HR Admin</option>
                    <option value="md">Managing Director</option>
                  </select>
                </div>
              </div>

              {role === "employee" && (
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-455 uppercase mb-1.5 tracking-wider">Reports to Manager</label>
                  <select
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-bold"
                  >
                    <option value="">Select Manager</option>
                    {users
                      .filter(u => u.role === "manager" || u.role === "hr" || u.role === "md")
                      .map(u => (
                        <option key={u.id} value={u.name}>
                          {u.name} ({u.role === "manager" ? "Line Manager" : u.role === "hr" ? "HR Admin" : "MD"})
                        </option>
                      ))
                    }
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all mt-2"
              >
                Provision Account
              </button>
            </form>
          </div>

        </div>

      </div>
    </ERPLayout>
  );
}
