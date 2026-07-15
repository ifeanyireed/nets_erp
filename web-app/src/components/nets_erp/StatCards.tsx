"use client";

import React, { useState, useEffect } from "react";
import { IconClipboardCheck, IconStar, IconClock, IconUsers } from "@tabler/icons-react";
import { useERPStore, User } from "@/lib/erp-store";

export default function StatCards() {
  const { reviews, users, cycles } = useERPStore();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("erp_current_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    }
  }, []);

  if (!currentUser) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 min-h-[125px] animate-pulse flex items-center justify-center text-xs text-slate-400 font-bold">
            Loading metrics...
          </div>
        ))}
      </section>
    );
  }

  const role = currentUser.role;

  // Render cards based on User Role
  if (role === "employee") {
    const activeCycle = cycles.find(c => c.status === "Active");
    const myActiveReview = reviews.find(r => r.employeeId === currentUser.id && r.cycleId === activeCycle?.id);
    const myReviewStatus = myActiveReview ? myActiveReview.status : "No Active Cycle";

    const completedScores = reviews
      .filter(r => r.employeeId === currentUser.id && r.status === "HR Approved" && r.finalScore !== undefined)
      .map(r => Number((r.finalScore || 0).toFixed(1)));

    const trend = currentUser.ratingTrend && currentUser.ratingTrend.length > 0
      ? [...currentUser.ratingTrend, ...completedScores]
      : [7.0, 7.5, ...completedScores];
    const latestRating = trend.length > 0 ? trend[trend.length - 1] : 0;

    const pendingText = myReviewStatus === "Draft" || myReviewStatus === "Returned" 
      ? "Assessment Due" 
      : myReviewStatus === "Submitted" 
      ? "Pending Manager" 
      : myReviewStatus === "Manager Reviewed" 
      ? "Pending HR Sign-off"
      : "No Action Needed";

    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* CARD 1: My Review Status */}
        <div className="bg-blue-600 rounded-[24px] p-5 shadow-sm border border-blue-500/10 flex flex-col justify-between min-h-[125px] transition-all hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <IconClipboardCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold text-blue-100 tracking-wide">Review Status</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-black text-white uppercase">{myReviewStatus}</h3>
            <p className="text-[10px] text-blue-200/80 font-semibold mt-1">Current performance cycle status</p>
          </div>
        </div>

        {/* CARD 2: Latest Performance Rating */}
        <div className="bg-[#E6F4EA] rounded-[24px] p-5 shadow-sm border border-emerald-100/30 flex flex-col justify-between min-h-[125px] transition-all hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600/10 flex items-center justify-center">
                <IconStar className="w-5 h-5 text-emerald-700" />
              </div>
              <span className="text-xs font-bold text-emerald-800 tracking-wide">Latest Rating</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-emerald-900">{latestRating ? `${latestRating} / 10` : "N/A"}</h3>
            <p className="text-[10px] text-emerald-700/60 font-semibold mt-1">Previous performance trend score</p>
          </div>
        </div>

        {/* CARD 3: My Actions */}
        <div className="bg-[#FCE8E6] rounded-[24px] p-5 shadow-sm border border-red-100/30 flex flex-col justify-between min-h-[125px] transition-all hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-600/10 flex items-center justify-center">
                <IconClock className="w-5 h-5 text-red-700" />
              </div>
              <span className="text-xs font-bold text-red-800 tracking-wide">My Actions</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-black text-red-900">{pendingText}</h3>
            <p className="text-[10px] text-red-700/60 font-semibold mt-1">Your immediate action item</p>
          </div>
        </div>

        {/* CARD 4: My Department */}
        <div className="bg-[#E8F0FE] rounded-[24px] p-5 shadow-sm border border-blue-100/30 flex flex-col justify-between min-h-[125px] transition-all hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center">
                <IconUsers className="w-5 h-5 text-blue-700" />
              </div>
              <span className="text-xs font-bold text-blue-800 tracking-wide">My Department</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-blue-900">{currentUser.department}</h3>
            <p className="text-[10px] text-blue-700/60 font-semibold mt-1">Your assigned department</p>
          </div>
        </div>
      </section>
    );
  }

  if (role === "manager") {
    const directReports = users.filter(u => u.managerName === currentUser.name);
    const teamIds = directReports.map(u => u.id);

    const teamReviews = reviews.filter(r => teamIds.includes(r.employeeId) && r.cycleId === "CYC001");
    const completedTeamCount = teamReviews.filter(r => r.status === "Manager Reviewed" || r.status === "HR Approved").length;
    const totalTeamCount = directReports.length;
    const completionRate = totalTeamCount > 0 ? Math.round((completedTeamCount / totalTeamCount) * 100) : 0;

    const pendingReviewsCount = teamReviews.filter(r => r.status === "Submitted").length;

    const scoredReviews = teamReviews.filter(r => r.finalScore !== undefined && r.finalScore !== null);
    const avgScore = scoredReviews.length > 0
      ? (scoredReviews.reduce((sum, r) => sum + (r.finalScore || 0), 0) / scoredReviews.length).toFixed(1)
      : "N/A";

    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* CARD 1: Team Completion */}
        <div className="bg-blue-600 rounded-[24px] p-5 shadow-sm border border-blue-500/10 flex flex-col justify-between min-h-[125px] transition-all hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <IconClipboardCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold text-blue-100 tracking-wide">Team Completion</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white">{completionRate}%</h3>
            <p className="text-[10px] text-blue-200/80 font-semibold mt-1">{completedTeamCount} of {totalTeamCount} reports approved</p>
          </div>
        </div>

        {/* CARD 2: Team Avg Score */}
        <div className="bg-[#E6F4EA] rounded-[24px] p-5 shadow-sm border border-emerald-100/30 flex flex-col justify-between min-h-[125px] transition-all hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600/10 flex items-center justify-center">
                <IconStar className="w-5 h-5 text-emerald-700" />
              </div>
              <span className="text-xs font-bold text-emerald-800 tracking-wide">Team Avg Score</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-emerald-900">{avgScore} <span className="text-xs text-emerald-600 font-bold">/ 10</span></h3>
            <p className="text-[10px] text-emerald-700/60 font-semibold mt-1">Average audited direct report score</p>
          </div>
        </div>

        {/* CARD 3: Pending Appraisals */}
        <div className="bg-[#FCE8E6] rounded-[24px] p-5 shadow-sm border border-red-100/30 flex flex-col justify-between min-h-[125px] transition-all hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-600/10 flex items-center justify-center">
                <IconClock className="w-5 h-5 text-red-700" />
              </div>
              <span className="text-xs font-bold text-red-800 tracking-wide">Pending Appraisals</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-red-900">{pendingReviewsCount} Reviews</h3>
            <p className="text-[10px] text-red-700/60 font-semibold mt-1">Awaiting manager score evaluation</p>
          </div>
        </div>

        {/* CARD 4: direct reports */}
        <div className="bg-[#E8F0FE] rounded-[24px] p-5 shadow-sm border border-blue-100/30 flex flex-col justify-between min-h-[125px] transition-all hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center">
                <IconUsers className="w-5 h-5 text-blue-700" />
              </div>
              <span className="text-xs font-bold text-blue-800 tracking-wide">Direct Reports</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-blue-900">{directReports.length} Employees</h3>
            <p className="text-[10px] text-blue-700/60 font-semibold mt-1">Directly reporting to you</p>
          </div>
        </div>
      </section>
    );
  }

  // HR & MD Global stats
  const activeCycleReviews = reviews.filter(r => r.cycleId === "CYC001");
  const totalEmployeesCount = users.filter(u => u.role !== "admin").length;
  const hrApprovedCount = activeCycleReviews.filter(r => r.status === "HR Approved").length;
  const globalCompletionRate = totalEmployeesCount > 0 ? Math.round((hrApprovedCount / totalEmployeesCount) * 100) : 0;

  const hrScoredReviews = activeCycleReviews.filter(r => r.finalScore !== undefined && r.finalScore !== null);
  const globalAvgScore = hrScoredReviews.length > 0
    ? (hrScoredReviews.reduce((sum, r) => sum + (r.finalScore || 0), 0) / hrScoredReviews.length).toFixed(1)
    : "N/A";

  const reviewsAwaitingHrAudit = activeCycleReviews.filter(r => r.status === "Manager Reviewed").length;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* CARD 1: Completion Rate */}
      <div className="bg-blue-600 rounded-[24px] p-5 shadow-sm border border-blue-500/10 flex flex-col justify-between min-h-[125px] transition-all hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <IconClipboardCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold text-blue-100 tracking-wide">Completion Rate</span>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-white">{globalCompletionRate}%</h3>
          <p className="text-[10px] text-blue-200/80 font-semibold mt-1">{hrApprovedCount} of {totalEmployeesCount} evaluations completed</p>
        </div>
      </div>

      {/* CARD 2: Average Rating */}
      <div className="bg-[#E6F4EA] rounded-[24px] p-5 shadow-sm border border-emerald-100/30 flex flex-col justify-between min-h-[125px] transition-all hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/10 flex items-center justify-center">
              <IconStar className="w-5 h-5 text-emerald-700" />
            </div>
            <span className="text-xs font-bold text-emerald-800 tracking-wide">Average Score</span>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-emerald-900">{globalAvgScore} <span className="text-xs text-emerald-600 font-bold">/ 10</span></h3>
          <p className="text-[10px] text-emerald-700/60 font-semibold mt-1">Average score across audited staff</p>
        </div>
      </div>

      {/* CARD 3: Pending Audits */}
      <div className="bg-[#FCE8E6] rounded-[24px] p-5 shadow-sm border border-red-100/30 flex flex-col justify-between min-h-[125px] transition-all hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-600/10 flex items-center justify-center">
              <IconClock className="w-5 h-5 text-red-700" />
            </div>
            <span className="text-xs font-bold text-red-800 tracking-wide">Pending Audits</span>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-red-900">{reviewsAwaitingHrAudit} Reviews</h3>
          <p className="text-[10px] text-red-700/60 font-semibold mt-1">Awaiting HR final verification audit</p>
        </div>
      </div>

      {/* CARD 4: Active Staff */}
      <div className="bg-[#E8F0FE] rounded-[24px] p-5 shadow-sm border border-blue-100/30 flex flex-col justify-between min-h-[125px] transition-all hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center">
              <IconUsers className="w-5 h-5 text-blue-700" />
            </div>
            <span className="text-xs font-bold text-blue-800 tracking-wide">Active Staff</span>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-blue-900">{totalEmployeesCount} Staff</h3>
          <p className="text-[10px] text-blue-700/60 font-semibold mt-1">Total active staff enrolled in cycle</p>
        </div>
      </div>
    </section>
  );
}
