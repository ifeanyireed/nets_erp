"use client";

import { useEffect, useState } from "react";

export type Role = "employee" | "manager" | "hr" | "md";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  avatar: string;
  managerName?: string;
  ratingTrend?: number[];
  designation?: string;
  gradeLevel?: string;
  employmentDate?: string;
  company?: string;
  location?: string;
  password?: string;
}

export function getParentDept(deptName: string): string {
  if (!deptName) return "Other";
  const name = deptName.trim();
  if (name.startsWith("Fleet")) return "Fleet";
  if (name.startsWith("Marketing")) return "Marketing";
  if (name.startsWith("NOC")) return "NOC";
  if (name.startsWith("Finance") || name.startsWith("ERP/IT")) return "Finance & Accounts";
  if (name.startsWith("Admin/HR")) return "Admin/HR";
  if (name.startsWith("HR")) return "Human Resources";
  if (name.startsWith("Legal")) return "Legal";
  if (name.startsWith("Workshop")) return "Workshop";
  if (name.startsWith("Internal Control")) return "Internal Control";
  if (name.startsWith("KHLC")) return "KHLC/Skillup";
  return "Other";
}

export const DEPARTMENTS = [
  "Admin/HR 1 (Front Desk & Account Support)",
  "Admin/HR 2 (Front Desk)",
  "Admin/HR 3 (Office Assistant)",
  "ERP/IT 1 (ERP/IT Officer)",
  "Finance 1 (Acc Payable)",
  "Finance 2 (Acc Receivable)",
  "Finance 3 (Accountant)",
  "Finance 4 (Finance Analyst)",
  "Finance 5 (Head of Finance)",
  "Fleet 1 (Bus Assistant)",
  "Fleet 2 (Fleet Officer)",
  "Fleet 3 (Fleet Support Officer)",
  "Fleet 4 (Facility Manager)",
  "Fleet 5 (Fleet Maintenance North)",
  "Fleet 6 (Fleet Operations Manager)",
  "Fleet 7 (HSE Executive)",
  "Fleet 8 (Fleet Supervisor)",
  "HR 1 (HR Executive 1)",
  "HR 2 (HR Executive 2)",
  "HR 3 (Head of HR)",
  "Head of Operations",
  "Internal Control 1 (Internal Control)",
  "Legal 1 (Legal Counsel & EA)",
  "Legal 2 (Legal Counsel)",
  "Marketing 1 (Head of Marketing)",
  "Marketing 2 (Marketing Executive & CSR)",
  "Marketing 3 (Marketing Executive)",
  "Marketing 4 (Marketing Manager)",
  "Marketing 5 (Social Media Executive)",
  "Marketing 6 (Sales Closer)",
  "NOC 1 (Fleet Monitoring & NOC Supervisor)",
  "NOC 2 (Fleet Monitoring Officer)",
  "Workshop 1 (Mechanic)",
  "Workshop 2 (Workshop Assistant)",
  "Workshop 3 (Workshop Manager)",
  "KHLC 1 (Instructor)",
  "KHLC 2 (Supervisor)",
  "KHLC 3 (Program Coordinator)",
  "KHLC 4 (Admin Officer)"
] as const;

export interface ReviewCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "Draft" | "Active" | "Completed";
  departments: string[];
}

export interface Objective {
  id: string;
  text: string;
  weight: number; // percentage
  type: "competency" | "objective"; // Categorized rating
  expectedLevel?: number; // Expected competency level (1-5)
  category?: "Behavioural" | "Leadership" | "Technical" | "Culture" | "Role Specific" | "Self-Development" | string;
  departments?: string[];
  selfScore?: number;
  managerScore?: number;
  comments?: string;
  evidence?: string;
  managerFeedback?: string;
  description?: string[];
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  cycleId: string;
  cycleName: string;
  status: "Draft" | "Submitted" | "Manager Reviewed" | "HR Approved" | "Returned";
  objectives: Objective[];
  employeeComments?: string;
  managerComments?: string;
  hrComments?: string;
  finalScore?: number;
  updatedAt: string;
}

// Initial Mock Data
const INITIAL_USERS: User[] = [
  { id: "260301", name: "Emmanuel Victor Okon", email: "emmanuel.okon@neweratransports.com", password: "12345678", role: "manager", department: "Fleet 1 (Bus Assistant)", avatar: "/character3.jpg", managerName: undefined, ratingTrend: [7.5, 7.8, 8.0], designation: "Head of Operations Lagos", gradeLevel: "-", employmentDate: "2021-07-01 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260302", name: "Eneanoh Mmachimerem Ugonna", email: "eneanoh.ugonna@neweratransports.com", password: "12345678", role: "manager", department: "Fleet 1 (Bus Assistant)", avatar: "/character4.jpg", managerName: undefined, ratingTrend: [7.5, 7.8, 8.0], designation: "Regional Head of Operations", gradeLevel: "-", employmentDate: "2015-02-01 00:00:00", company: "NETS", location: "South East" },
  { id: "260303", name: "Samali Umoru James", email: "samali.james@neweratransports.com", password: "12345678", role: "manager", department: "Fleet 1 (Bus Assistant)", avatar: "/character5.jpg", managerName: undefined, ratingTrend: [7.5, 7.8, 8.0], designation: "Fleet Manager Ibadan", gradeLevel: "-", employmentDate: "2023-03-01 00:00:00", company: "NETS", location: "Ibadan" },
  { id: "260304", name: "Buoro  Abubakar Idris", email: "buoro.idris@neweratransports.com", password: "12345678", role: "manager", department: "Fleet 1 (Bus Assistant)", avatar: "/character6.jpg", managerName: undefined, ratingTrend: [7.5, 7.8, 8.0], designation: "Fleer Manager Kano", gradeLevel: "-", employmentDate: "2020-01-11 00:00:00", company: "NETS", location: "Kano" },
  { id: "260305", name: "Asiegbu  Chioma John", email: "asiegbu.john@neweratransports.com", password: "12345678", role: "employee", department: "Marketing 2 (Marketing Executive & CSR)", avatar: "/character7.jpg", managerName: "Divine Favour Chi Egbomuche", ratingTrend: [7.5, 7.8, 8.0], designation: "Marketing Executive/CSR", gradeLevel: "-", employmentDate: "2023-02-01 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260306", name: "Saheed Akanbi  Yusuf", email: "saheed.yusuf@neweratransports.com", password: "12345678", role: "manager", department: "Fleet 4 (Facility Manager)", avatar: "/character8.jpg", managerName: undefined, ratingTrend: [7.5, 7.8, 8.0], designation: "Facility Manager", gradeLevel: "-", employmentDate: "2023-11-27 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260307", name: "Iheukwumere Friday Kelechi", email: "iheukwumere.kelechi@neweratransports.com", password: "12345678", role: "employee", department: "Fleet 8 (Fleet Supervisor)", avatar: "/character9.jpg", managerName: "Akanbi Latifat Omolade", ratingTrend: [7.5, 7.8, 8.0], designation: "Fleet Supervisor Enugu", gradeLevel: "-", employmentDate: "2022-03-01 00:00:00", company: "NETS", location: "Enugu" },
  { id: "260308", name: "Tumie Johnson Ekanmbakumo", email: "tumie.ekanmbakumo@neweratransports.com", password: "12345678", role: "employee", department: "Fleet 2 (Fleet Officer)", avatar: "/character10.jpg", managerName: "Akanbi Latifat Omolade", ratingTrend: [7.5, 7.8, 8.0], designation: "Fleet officer", gradeLevel: "-", employmentDate: "2024-03-01 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260309", name: "Chidimma Maureen Uzoukwu", email: "chidimma.uzoukwu@neweratransports.com", password: "12345678", role: "employee", department: "NOC 1 (Fleet Monitoring & NOC Supervisor)", avatar: "/character11.jpg", managerName: "Chidimma Maureen Uzoukwu", ratingTrend: [7.5, 7.8, 8.0], designation: "NOC Supervisor", gradeLevel: "-", employmentDate: "2024-05-02 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260310", name: "Aremu Abiodun Najeem", email: "aremu.najeem@neweratransports.com", password: "12345678", role: "employee", department: "Fleet 8 (Fleet Supervisor)", avatar: "/character12.jpg", managerName: "Akanbi Latifat Omolade", ratingTrend: [7.5, 7.8, 8.0], designation: "Fleet Supervisor Ibadan", gradeLevel: "-", employmentDate: "2024-02-07 00:00:00", company: "NETS", location: "Ibadan" },
  { id: "260311", name: "Babalola Imoleayo Adelakun", email: "babalola.adelakun@neweratransports.com", password: "12345678", role: "employee", department: "Fleet 8 (Fleet Supervisor)", avatar: "/character13.jpg", managerName: "Akanbi Latifat Omolade", ratingTrend: [7.5, 7.8, 8.0], designation: "Fleet Supervisor NBC", gradeLevel: "-", employmentDate: "2024-02-28 00:00:00", company: "NETS", location: "Benin" },
  { id: "260312", name: "Oluwasijibomi Ebenezer Akinsohun", email: "oluwasijibomi.akinsohun@neweratransports.com", password: "12345678", role: "employee", department: "Fleet 8 (Fleet Supervisor)", avatar: "/character1.jpg", managerName: "Akanbi Latifat Omolade", ratingTrend: [7.5, 7.8, 8.0], designation: "Fleet Supervisor YNV", gradeLevel: "-", employmentDate: "2024-07-15 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260313", name: "Arotile Rotimi Seyi", email: "arotile.seyi@neweratransports.com", password: "12345678", role: "manager", department: "Finance 5 (Head of Finance)", avatar: "/character2.jpg", managerName: undefined, ratingTrend: [7.5, 7.8, 8.0], designation: "Head of Finance", gradeLevel: "-", employmentDate: "2024-08-08 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260314", name: "Esther Victor Obilor", email: "esther.obilor@neweratransports.com", password: "12345678", role: "employee", department: "Finance 3 (Accountant)", avatar: "/character3.jpg", managerName: "Arotile Rotimi Seyi", ratingTrend: [7.5, 7.8, 8.0], designation: "Accountant", gradeLevel: "-", employmentDate: "2024-11-01 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260315", name: "Ochiabuto Chinonso Sophia", email: "ochiabuto.sophia@neweratransports.com", password: "12345678", role: "employee", department: "Marketing 5 (Social Media Executive)", avatar: "/character4.jpg", managerName: "Divine Favour Chi Egbomuche", ratingTrend: [7.5, 7.8, 8.0], designation: "Social Media Executive", gradeLevel: "-", employmentDate: "2024-11-01 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260316", name: "Kennedy Chukwudi Salvation", email: "kennedy.salvation@neweratransports.com", password: "12345678", role: "employee", department: "Fleet 1 (Bus Assistant)", avatar: "/character5.jpg", managerName: "Akanbi Latifat Omolade", ratingTrend: [7.5, 7.8, 8.0], designation: "Fuel Tracking Executive", gradeLevel: "-", employmentDate: "2025-01-06 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260317", name: "Opeyemi Ismaila", email: "opeyemi.ismaila@neweratransports.com", password: "12345678", role: "employee", department: "Admin/HR 1 (Front Desk & Account Support)", avatar: "/character6.jpg", managerName: "Robert Vance", ratingTrend: [7.5, 7.8, 8.0], designation: "Front Desk officer Funmy", gradeLevel: "-", employmentDate: "2025-01-08 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260318", name: "Adefehintoye Adedeji", email: "adefehintoye.adedeji@neweratransports.com", password: "12345678", role: "employee", department: "Fleet 8 (Fleet Supervisor)", avatar: "/character7.jpg", managerName: "Akanbi Latifat Omolade", ratingTrend: [7.5, 7.8, 8.0], designation: "Fleet Supervisor I H S", gradeLevel: "-", employmentDate: "2025-02-14 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260319", name: "Odubiyi Oluwaseun", email: "odubiyi.oluwaseun@neweratransports.com", password: "12345678", role: "employee", department: "Fleet 1 (Bus Assistant)", avatar: "/character8.jpg", managerName: "Akanbi Latifat Omolade", ratingTrend: [7.5, 7.8, 8.0], designation: "Fleet Support Wasimi", gradeLevel: "-", employmentDate: "March 17th 2025", company: "NETS", location: "Ogun" },
  { id: "260320", name: "Helen Ajoke John", email: "helen.john@neweratransports.com", password: "12345678", role: "employee", department: "Fleet 1 (Bus Assistant)", avatar: "/character9.jpg", managerName: "Akanbi Latifat Omolade", ratingTrend: [7.5, 7.8, 8.0], designation: "BUS ASSISTANT", gradeLevel: "-", employmentDate: "March 24th 2025", company: "NETS", location: "Lagos" },
  { id: "260321", name: "Akanbi Latifat Omolade", email: "akanbi.omolade@neweratransports.com", password: "12345678", role: "employee", department: "Fleet 8 (Fleet Supervisor)", avatar: "/character10.jpg", managerName: "Akanbi Latifat Omolade", ratingTrend: [7.5, 7.8, 8.0], designation: "FLEET SUPERVISOR NBC", gradeLevel: "-", employmentDate: "2025-05-01 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260322", name: "Fatai Adebule", email: "fatai.adebule@neweratransports.com", password: "12345678", role: "employee", department: "Fleet 1 (Bus Assistant)", avatar: "/character11.jpg", managerName: "Akanbi Latifat Omolade", ratingTrend: [7.5, 7.8, 8.0], designation: "MECHANIC", gradeLevel: "-", employmentDate: "2025-05-15 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260323", name: "Divine Favour Chi Egbomuche", email: "divine.egbomuche@neweratransports.com", password: "12345678", role: "manager", department: "Marketing 1 (Head of Marketing)", avatar: "/character12.jpg", managerName: undefined, ratingTrend: [7.5, 7.8, 8.0], designation: "Head Of Marketing", gradeLevel: "-", employmentDate: "2025-08-01 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260324", name: "Egba Stella Adutomivie", email: "egba.adutomivie@neweratransports.com", password: "12345678", role: "employee", department: "HR 1 (HR Executive 1)", avatar: "/character13.jpg", managerName: "Kalu Gift Kelechi", ratingTrend: [7.5, 7.8, 8.0], designation: "HR EXECUTIVE", gradeLevel: "-", employmentDate: "2025-08-01 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260325", name: "Isaac Ekpo James", email: "isaac.james@neweratransports.com", password: "12345678", role: "employee", department: "Marketing 2 (Marketing Executive & CSR)", avatar: "/character1.jpg", managerName: "Divine Favour Chi Egbomuche", ratingTrend: [7.5, 7.8, 8.0], designation: "MARKETING EXECUTIVE", gradeLevel: "-", employmentDate: "2025-08-01 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260326", name: "Kalu Gift Kelechi", email: "kalu.kelechi@neweratransports.com", password: "12345678", role: "hr", department: "HR 3 (Head of HR)", avatar: "/character2.jpg", managerName: undefined, ratingTrend: [7.5, 7.8, 8.0], designation: "HEAD HR", gradeLevel: "-", employmentDate: "2025-08-11 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260327", name: "Ekwealor Oluchi Ugochi", email: "ekwealor.ugochi@neweratransports.com", password: "12345678", role: "employee", department: "NOC 2 (Fleet Monitoring Officer)", avatar: "/character3.jpg", managerName: "Chidimma Maureen Uzoukwu", ratingTrend: [7.5, 7.8, 8.0], designation: "Fleet Monitoring Officer NOC", gradeLevel: "-", employmentDate: "2025-08-15 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260328", name: "Onebunne Ginika Perpetus", email: "onebunne.perpetus@neweratransports.com", password: "12345678", role: "employee", department: "NOC 2 (Fleet Monitoring Officer)", avatar: "/character4.jpg", managerName: "Chidimma Maureen Uzoukwu", ratingTrend: [7.5, 7.8, 8.0], designation: "Fleet Monitoring Officer NOC", gradeLevel: "-", employmentDate: "2025-08-15 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260329", name: "Ogundipe Femi Felix", email: "ogundipe.felix@neweratransports.com", password: "12345678", role: "employee", department: "Finance 4 (Finance Analyst)", avatar: "/character5.jpg", managerName: "Arotile Rotimi Seyi", ratingTrend: [7.5, 7.8, 8.0], designation: "FINANCE ANALYST", gradeLevel: "-", employmentDate: "2025-09-01 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260330", name: "Anucha Oluebube Precious", email: "anucha.precious@neweratransports.com", password: "12345678", role: "employee", department: "Admin/HR 3 (Office Assistant)", avatar: "/character6.jpg", managerName: "Robert Vance", ratingTrend: [7.5, 7.8, 8.0], designation: "OFFICE ASSISTANT", gradeLevel: "-", employmentDate: "2025-09-16 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260331", name: "Ibemere Onyekachi Precious", email: "ibemere.precious@neweratransports.com", password: "12345678", role: "employee", department: "NOC 2 (Fleet Monitoring Officer)", avatar: "/character7.jpg", managerName: "Chidimma Maureen Uzoukwu", ratingTrend: [7.5, 7.8, 8.0], designation: "Fleet Monitoring Officer NOC", gradeLevel: "-", employmentDate: "2025-09-16 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260332", name: "Nwaoha Michael Onyekwere", email: "nwaoha.onyekwere@neweratransports.com", password: "12345678", role: "employee", department: "Fleet 7 (HSE Executive)", avatar: "/character8.jpg", managerName: "Akanbi Latifat Omolade", ratingTrend: [7.5, 7.8, 8.0], designation: "HSE EXECUTIVE", gradeLevel: "-", employmentDate: "2025-09-29 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260333", name: "Ishaq Ibrahim", email: "ishaq.ibrahim@neweratransports.com", password: "12345678", role: "employee", department: "Fleet 1 (Bus Assistant)", avatar: "/character9.jpg", managerName: "Akanbi Latifat Omolade", ratingTrend: [7.5, 7.8, 8.0], designation: "FLEET MAINTENANCE OFFICER NORTH", gradeLevel: "-", employmentDate: "2025-10-01 00:00:00", company: "NETS", location: "Kano" },
  { id: "260334", name: "Umezurike Esther Chinaza", email: "umezurike.chinaza@neweratransports.com", password: "12345678", role: "employee", department: "Admin/HR 1 (Front Desk & Account Support)", avatar: "/character10.jpg", managerName: "Robert Vance", ratingTrend: [7.5, 7.8, 8.0], designation: "FRONT DESK/ Account Support NETS", gradeLevel: "-", employmentDate: "2025-11-01 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260335", name: "Apeh Blessing Ojone", email: "apeh.ojone@neweratransports.com", password: "12345678", role: "employee", department: "Marketing 6 (Sales Closer)", avatar: "/character11.jpg", managerName: "Divine Favour Chi Egbomuche", ratingTrend: [7.5, 7.8, 8.0], designation: "Sales Closer", gradeLevel: "-", employmentDate: "2025-11-25 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260336", name: "Adenigba Elizabeth Adejumoke", email: "adenigba.adejumoke@neweratransports.com", password: "12345678", role: "employee", department: "Marketing 6 (Sales Closer)", avatar: "/character12.jpg", managerName: "Divine Favour Chi Egbomuche", ratingTrend: [7.5, 7.8, 8.0], designation: "Sales Closer", gradeLevel: "-", employmentDate: "2025-12-01 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260337", name: "Edith Abosede Friday", email: "edith.friday@neweratransports.com", password: "12345678", role: "employee", department: "Marketing 6 (Sales Closer)", avatar: "/character13.jpg", managerName: "Divine Favour Chi Egbomuche", ratingTrend: [7.5, 7.8, 8.0], designation: "Sales Closer", gradeLevel: "-", employmentDate: "2025-12-01 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260338", name: "Chijioke David Somtochukwu", email: "chijioke.somtochukwu@neweratransports.com", password: "12345678", role: "employee", department: "NOC 2 (Fleet Monitoring Officer)", avatar: "/character1.jpg", managerName: "Chidimma Maureen Uzoukwu", ratingTrend: [7.5, 7.8, 8.0], designation: "Fleet Monitoring Officer NOC", gradeLevel: "-", employmentDate: "2025-12-01 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260339", name: "Ifeanyi Gerald Obinna", email: "ifeanyi.obinna@neweratransports.com", password: "12345678", role: "employee", department: "Marketing 6 (Sales Closer)", avatar: "/character2.jpg", managerName: "Divine Favour Chi Egbomuche", ratingTrend: [7.5, 7.8, 8.0], designation: "Sales Closer", gradeLevel: "-", employmentDate: "2025-12-04 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260340", name: "Abosede Ajayi", email: "abosede.ajayi@neweratransports.com", password: "12345678", role: "employee", department: "Marketing 6 (Sales Closer)", avatar: "/character3.jpg", managerName: "Divine Favour Chi Egbomuche", ratingTrend: [7.5, 7.8, 8.0], designation: "Sales Closer", gradeLevel: "-", employmentDate: "2025-12-16 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260341", name: "Oluwatobiloba Olateju", email: "oluwatobiloba.olateju@neweratransports.com", password: "12345678", role: "employee", department: "Finance 1 (Acc Payable)", avatar: "/character4.jpg", managerName: "Arotile Rotimi Seyi", ratingTrend: [7.5, 7.8, 8.0], designation: "ERP/IT Officer", gradeLevel: "-", employmentDate: "2026-01-19 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260342", name: "Salami Muibat", email: "salami.muibat@neweratransports.com", password: "12345678", role: "employee", department: "Fleet 1 (Driver)", avatar: "/character5.jpg", managerName: "Robert Vance", ratingTrend: [7.5, 7.8, 8.0], designation: "Office Assistance", gradeLevel: "-", employmentDate: "2025-12-16 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260343", name: "Idowu Aina Victoria", email: "idowu.victoria@neweratransports.com", password: "12345678", role: "employee", department: "NOC 2 (Fleet Monitoring Officer)", avatar: "/character6.jpg", managerName: "Chidimma Maureen Uzoukwu", ratingTrend: [7.5, 7.8, 8.0], designation: "Fleet Monitoring Officer NOC", gradeLevel: "-", employmentDate: "2026-01-20 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260344", name: "Akorede Sandra Bisola", email: "akorede.bisola@neweratransports.com", password: "12345678", role: "employee", department: "Legal 2 (Legal Counsel)", avatar: "/character7.jpg", managerName: "Robert Vance", ratingTrend: [7.5, 7.8, 8.0], designation: "Legal Counsel/EA", gradeLevel: "-", employmentDate: "2026-01-12 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260345", name: "Goldy Godfrey", email: "goldy.godfrey@neweratransports.com", password: "12345678", role: "employee", department: "HR 1 (HR Executive 1)", avatar: "/character8.jpg", managerName: "Kalu Gift Kelechi", ratingTrend: [7.5, 7.8, 8.0], designation: "HR Executive", gradeLevel: "-", employmentDate: "2026-01-21 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260346", name: "Sanusi Hamid Agboworin", email: "sanusi.agboworin@neweratransports.com", password: "12345678", role: "manager", department: "Workshop 3 (Workshop Manager)", avatar: "/character9.jpg", managerName: undefined, ratingTrend: [7.5, 7.8, 8.0], designation: "Workshop Manager", gradeLevel: "-", employmentDate: "2026-01-05 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260347", name: "Emeka Okoro", email: "emeka.okoro@neweratransports.com", password: "12345678", role: "manager", department: "Internal Control 1 (Internal Control)", avatar: "/character10.jpg", managerName: undefined, ratingTrend: [7.5, 7.8, 8.0], designation: "IC Manager", gradeLevel: "-", employmentDate: "2024-02-19 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260348", name: "David Mbacha", email: "david.mbacha@neweratransports.com", password: "12345678", role: "employee", department: "Finance 1 (Acc Payable)", avatar: "/character11.jpg", managerName: "Arotile Rotimi Seyi", ratingTrend: [7.5, 7.8, 8.0], designation: "ERP/IT Officer", gradeLevel: "-", employmentDate: "2025-01-20 00:00:00", company: "NETS", location: "Lagos" },
  { id: "260349", name: "Emmah James Ekanem", email: "emmah.ekanem@neweratransports.com", password: "12345678", role: "employee", department: "Workshop 1 (Mechanic)", avatar: "/character12.jpg", managerName: "Sanusi Hamid Agboworin", ratingTrend: [7.5, 7.8, 8.0], designation: "Workshop Staff", gradeLevel: "-", employmentDate: "1st Nov 2025", company: "NETS", location: "Lagos" },
  { id: "260350", name: "Onyinyechi Nwoye", email: "onyinyechi.nwoye@neweratransports.com", password: "12345678", role: "employee", department: "Admin/HR 3 (Office Assistant)", avatar: "/character13.jpg", managerName: "Robert Vance", ratingTrend: [7.5, 7.8, 8.0], designation: "Office Assistant", gradeLevel: "-", employmentDate: "4th Feb 2026", company: "NETS", location: "Lagos" },
  { id: "260351", name: "Abideen Ajisegiri", email: "abideen.ajisegiri@neweratransports.com", password: "12345678", role: "employee", department: "Workshop 1 (Mechanic)", avatar: "/character1.jpg", managerName: "Sanusi Hamid Agboworin", ratingTrend: [7.5, 7.8, 8.0], designation: "Mechanic Intern", gradeLevel: "-", employmentDate: "1st Feb 2026", company: "NETS", location: "Lagos" },
  { id: "260352", name: "Odo Abuchi Emeka", email: "odo.emeka@neweratransports.com", password: "12345678", role: "employee", department: "Workshop 1 (Mechanic)", avatar: "/character2.jpg", managerName: "Sanusi Hamid Agboworin", ratingTrend: [7.5, 7.8, 8.0], designation: "Mechanic", gradeLevel: "-", employmentDate: "2nd March 2026", company: "NETS", location: "Lagos" },
  { id: "260353", name: "Nwodo Julius Chukwujekwu", email: "nwodo.chukwujekwu@neweratransports.com", password: "12345678", role: "employee", department: "Fleet 1 (Bus Assistant)", avatar: "/character3.jpg", managerName: "Akanbi Latifat Omolade", ratingTrend: [7.5, 7.8, 8.0], designation: "Driver", gradeLevel: "-", employmentDate: "2nd March 2026", company: "NETS", location: "Lagos" },
  { id: "260354", name: "Musa Binta", email: "musa.binta@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character4.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Admin/Relationship Officer", gradeLevel: "-", employmentDate: "1st Feberuary 2019", company: "KHLC", location: "Lagos" },
  { id: "260355", name: "Solomon Grace Amarachi", email: "solomon.amarachi@neweratransports.com", password: "12345678", role: "manager", department: "KHLC 3 (Program Coordinator)", avatar: "/character5.jpg", managerName: undefined, ratingTrend: [7.5, 7.8, 8.0], designation: "Program Coordinator", gradeLevel: "-", employmentDate: "25th October 2019", company: "KHLC", location: "Lagos" },
  { id: "260356", name: "Banwo Ibisola Yetunde", email: "banwo.yetunde@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 2 (Supervisor)", avatar: "/character6.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Supervisor", gradeLevel: "-", employmentDate: "1st sep 2022", company: "KHLC", location: "Lagos" },
  { id: "260357", name: "Lawal   Obanle Promise", email: "lawal.promise@neweratransports.com", password: "12345678", role: "manager", department: "KHLC 1 (Instructor)", avatar: "/character7.jpg", managerName: undefined, ratingTrend: [7.5, 7.8, 8.0], designation: "Head of Robotics", gradeLevel: "-", employmentDate: "2nd May 2024", company: "KHLC", location: "Lagos" },
  { id: "260358", name: "Akinwale Akinola Samson", email: "akinwale.samson@neweratransports.com", password: "12345678", role: "manager", department: "KHLC 1 (Instructor)", avatar: "/character8.jpg", managerName: undefined, ratingTrend: [7.5, 7.8, 8.0], designation: "Skill Up Coordinator", gradeLevel: "-", employmentDate: "1st May 2024", company: "KHLC", location: "Lagos" },
  { id: "260359", name: "Bala Blessing", email: "bala.blessing@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 2 (Supervisor)", avatar: "/character9.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Supervisor", gradeLevel: "-", employmentDate: "1st August 2024", company: "KHLC", location: "Lagos" },
  { id: "260360", name: "Iniobong Christiana Okokon", email: "iniobong.okokon@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character10.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Admin Assistant", gradeLevel: "-", employmentDate: "12th August 2024", company: "KHLC", location: "Lagos" },
  { id: "260361", name: "Ohaneze Irene Onyinyechi", email: "ohaneze.onyinyechi@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character11.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Social Media Officer", gradeLevel: "-", employmentDate: "October 9th 2025", company: "KHLC", location: "Lagos" },
  { id: "260362", name: "Bridget Ogochukwu Azuibuike", email: "bridget.azuibuike@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character12.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Corper", gradeLevel: "-", employmentDate: "5th  Jan 2026", company: "KHLC", location: "Lagos" },
  { id: "260363", name: "Chioma Benita Nwanolu", email: "chioma.nwanolu@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character13.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Corper", gradeLevel: "-", employmentDate: "5th  Jan 2026", company: "KHLC", location: "Lagos" },
  { id: "260364", name: "Alex Rita Nwakaego", email: "alex.nwakaego@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character1.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Social Media Officer/Corper", gradeLevel: "-", employmentDate: "June 17th, 2025", company: "KHLC", location: "Lagos" },
  { id: "260365", name: "Adedokun Khaleed Oluwatobiloba", email: "adedokun.oluwatobiloba@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 2 (Supervisor)", avatar: "/character2.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Supervisor", gradeLevel: "-", employmentDate: "22nd April 2024", company: "KHLC", location: "Lagos" },
  { id: "260366", name: "Nwantu Faith Titus", email: "nwantu.titus@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character3.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Instructor", gradeLevel: "-", employmentDate: "1st May 2022", company: "KHLC", location: "Lagos" },
  { id: "260367", name: "Favour Ezekiel Oladapo", email: "favour.oladapo@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character4.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Instructor", gradeLevel: "-", employmentDate: "31st October, 2022", company: "KHLC", location: "Lagos" },
  { id: "260368", name: "Faniyi Olawale Tosin", email: "faniyi.tosin@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character5.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Instructor", gradeLevel: "-", employmentDate: "3rd May 2023", company: "KHLC", location: "Lagos" },
  { id: "260369", name: "Adewuyi Stephen O", email: "adewuyi.o@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character6.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Instructor", gradeLevel: "-", employmentDate: "8th May 2024", company: "KHLC", location: "Lagos" },
  { id: "260370", name: "Tosin Oluwole Abioye", email: "tosin.abioye@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character7.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Instructor", gradeLevel: "-", employmentDate: "18th April 2024", company: "KHLC", location: "Lagos" },
  { id: "260371", name: "Okunuga Seyi Samuel", email: "okunuga.samuel@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character8.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Instructor", gradeLevel: "-", employmentDate: "8th May 2024", company: "KHLC", location: "Lagos" },
  { id: "260372", name: "Adeyemi Halimat Adedoyin", email: "adeyemi.adedoyin@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character9.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Instructor", gradeLevel: "-", employmentDate: "30th September 2024", company: "KHLC", location: "Lagos" },
  { id: "260373", name: "Williams Ajibola Olufunke", email: "williams.olufunke@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character10.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Instructor", gradeLevel: "-", employmentDate: "1st September 2024", company: "KHLC", location: "Lagos" },
  { id: "260374", name: "Rita Ochuwa Oghairo", email: "rita.oghairo@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character11.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Instructor", gradeLevel: "-", employmentDate: "17th September 2024", company: "KHLC", location: "Lagos" },
  { id: "260375", name: "Solomon Idowu Michael", email: "solomon.michael@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character12.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Instructor", gradeLevel: "-", employmentDate: "23rd September 2024", company: "KHLC", location: "Lagos" },
  { id: "260376", name: "Salaudeen Azeezat Arike", email: "salaudeen.arike@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character13.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Instructor", gradeLevel: "-", employmentDate: "May 12th 2025", company: "KHLC", location: "Lagos" },
  { id: "260377", name: "Deborah Dennis", email: "deborah.dennis@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character1.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Instructor", gradeLevel: "-", employmentDate: "August 1st, 2025", company: "KHLC", location: "Lagos" },
  { id: "260378", name: "Mary Awolola", email: "mary.awolola@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character2.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Instructor", gradeLevel: "-", employmentDate: "September 15th, 2025", company: "KHLC", location: "Lagos" },
  { id: "260379", name: "Adebanjo Matthew", email: "adebanjo.matthew@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character3.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Instructor", gradeLevel: "-", employmentDate: "6th October 2025", company: "KHLC", location: "Lagos" },
  { id: "260380", name: "Godday James Ejegale", email: "godday.ejegale@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character4.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Instructor", gradeLevel: "-", employmentDate: "13th October 2025", company: "KHLC", location: "Lagos" },
  { id: "260381", name: "Jerome Joy Karlisha", email: "jerome.karlisha@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character5.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Instructor", gradeLevel: "-", employmentDate: "September 15th, 2025", company: "KHLC", location: "Lagos" },
  { id: "260382", name: "Akaniyene Udo Akpan", email: "akaniyene.akpan@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character6.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Security", gradeLevel: "-", employmentDate: "1st  Nov 2025", company: "KHLC", location: "Lagos" },
  { id: "260383", name: "Olayiwola Omotayo", email: "olayiwola.omotayo@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character7.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "Instructor", gradeLevel: "-", employmentDate: "12th January 2026", company: "KHLC", location: "Lagos" },
  { id: "260384", name: "Joshua Obumneme Nwankwo", email: "joshua.nwankwo@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character8.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "SKILLUP Instructor", gradeLevel: "-", employmentDate: "4th March 2026", company: "KHLC", location: "Lagos" },
  { id: "260385", name: "Precious Mamar", email: "precious.mamar@neweratransports.com", password: "12345678", role: "employee", department: "KHLC 1 (Instructor)", avatar: "/character9.jpg", managerName: "Adedokun Khaleed Oluwatobiloba", ratingTrend: [7.5, 7.8, 8.0], designation: "STORE ATTENDANT CBT", gradeLevel: "-", employmentDate: "2026-02-01 00:00:00", company: "KHLC", location: "Lagos" },
  { id: "HR001", name: "Alice Johnson", email: "alice.johnson@neweratransports.com", password: "12345678", role: "hr", department: "HR 5 (HR Manager)", avatar: "/character12.jpg", managerName: undefined, ratingTrend: undefined, designation: "HR Manager", gradeLevel: "L1", employmentDate: "2020-01-01", company: "NETS", location: "Lagos" },
  { id: "MD001", name: "Robert Vance", email: "robert.vance@neweratransports.com", password: "12345678", role: "md", department: "Executive", avatar: "/character13.jpg", managerName: undefined, ratingTrend: undefined, designation: "Managing Director", gradeLevel: "L1", employmentDate: "2020-01-01", company: "NETS", location: "Lagos" }
];

const INITIAL_CYCLES: ReviewCycle[] = [
  { id: "CYC001", name: "2026 Mid-Year Performance Cycle", startDate: "2026-06-01", endDate: "2026-07-31", status: "Active", departments: ["Admin/HR 1 (Front Desk & Account Support)", "Admin/HR 2 (Front Desk)", "Admin/HR 3 (Office Assistant)", "ERP/IT 1 (ERP/IT Officer)", "Finance 1 (Acc Payable)", "Finance 2 (Acc Receivable)", "Finance 3 (Accountant)", "Finance 4 (Finance Analyst)", "Finance 5 (Head of Finance)", "Fleet 1 (Bus Assistant)", "Fleet 2 (Fleet Officer)", "Fleet 3 (Fleet Support Officer)", "Fleet 4 (Facility Manager)", "Fleet 5 (Fleet Maintenance North)", "Fleet 6 (Fleet Operations Manager)", "Fleet 7 (HSE Executive)", "Fleet 8 (Fleet Supervisor)", "HR 1 (HR Executive 1)", "HR 2 (HR Executive 2)", "HR 3 (Head of HR)", "Head of Operations", "Internal Control 1 (Internal Control)", "Legal 1 (Legal Counsel & EA)", "Legal 2 (Legal Counsel)", "Marketing 1 (Head of Marketing)", "Marketing 2 (Marketing Executive & CSR)", "Marketing 3 (Marketing Executive)", "Marketing 4 (Marketing Manager)", "Marketing 5 (Social Media Executive)", "Marketing 6 (Sales Closer)", "NOC 1 (Fleet Monitoring & NOC Supervisor)", "NOC 2 (Fleet Monitoring Officer)", "Workshop 1 (Mechanic)", "Workshop 2 (Workshop Assistant)", "Workshop 3 (Workshop Manager)", "KHLC 1 (Instructor)", "KHLC 2 (Supervisor)", "KHLC 3 (Program Coordinator)", "KHLC 4 (Admin Officer)"] },
  { id: "CYC002", name: "2025 Annual Review Cycle", startDate: "2025-11-01", endDate: "2025-12-15", status: "Completed", departments: ["Admin/HR 1 (Front Desk & Account Support)", "Admin/HR 2 (Front Desk)", "Admin/HR 3 (Office Assistant)", "ERP/IT 1 (ERP/IT Officer)", "Finance 1 (Acc Payable)", "Finance 2 (Acc Receivable)", "Finance 3 (Accountant)", "Finance 4 (Finance Analyst)", "Finance 5 (Head of Finance)", "Fleet 1 (Bus Assistant)", "Fleet 2 (Fleet Officer)", "Fleet 3 (Fleet Support Officer)", "Fleet 4 (Facility Manager)", "Fleet 5 (Fleet Maintenance North)", "Fleet 6 (Fleet Operations Manager)", "Fleet 7 (HSE Executive)", "Fleet 8 (Fleet Supervisor)", "HR 1 (HR Executive 1)", "HR 2 (HR Executive 2)", "HR 3 (Head of HR)", "Head of Operations", "Internal Control 1 (Internal Control)", "Legal 1 (Legal Counsel & EA)", "Legal 2 (Legal Counsel)", "Marketing 1 (Head of Marketing)", "Marketing 2 (Marketing Executive & CSR)", "Marketing 3 (Marketing Executive)", "Marketing 4 (Marketing Manager)", "Marketing 5 (Social Media Executive)", "Marketing 6 (Sales Closer)", "NOC 1 (Fleet Monitoring & NOC Supervisor)", "NOC 2 (Fleet Monitoring Officer)", "Workshop 1 (Mechanic)", "Workshop 2 (Workshop Assistant)", "Workshop 3 (Workshop Manager)", "KHLC 1 (Instructor)", "KHLC 2 (Supervisor)", "KHLC 3 (Program Coordinator)", "KHLC 4 (Admin Officer)"] }
];

const DEFAULT_OBJECTIVES: Objective[] = [
  { id: "OBJ_HUMAN_RESOURCES_1", text: "Visitor Management & Professional Appearance", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Admin/HR 1 (Front Desk & Account Support)"], description: ["Maintain 100% accurate front desk and visitor records", "Ensure financial documentation accuracy above 98%", "Provide timely administrative support for finance operations"] },
  { id: "OBJ_HUMAN_RESOURCES_2", text: "Front Desk Office Supplies & Task Execution", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Admin/HR 1 (Front Desk & Account Support)"], description: ["Ensure 100% professional demeanour and appearance at all times", "Timeliness in restocking of office supplies"] },
  { id: "OBJ_HUMAN_RESOURCES_3", text: "Visitor Management & Professional Appearance", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Admin/HR 2 (Front Desk)"], description: ["Ensure 100% registration and direction of visitors to their destination within 5 minutes of arrival", "Professional Appearance", "Ensure 100% professional demeanor and appearance at all times"] },
  { id: "OBJ_HUMAN_RESOURCES_4", text: "Front Desk Office Supplies & Task Execution", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Admin/HR 2 (Front Desk)"], description: ["Administrative Task", "Ensure constant supply/restock of toiletries and stationery each week", "Timely execution of all given tasks"] },
  { id: "OBJ_HUMAN_RESOURCES_5", text: "Convenience Area Cleanliness", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Admin/HR 3 (Office Assistant)"], description: ["Ensure all convenience areas (restrooms) are cleaned at least 3 times per day", "Timeliness and reliability in completing errands and tasks", "Proper handling of office items and supplies"] },
  { id: "OBJ_HUMAN_RESOURCES_6", text: "Office Operations Support", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Admin/HR 3 (Office Assistant)"], description: ["General support effectiveness in office operations"] },
  { id: "OBJ_ERP_IT_1", text: "ERP System Adoption", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["ERP/IT 1 (ERP/IT Officer)"], description: ["Percentage of employees actively using the enterprise system", "Percentage of time internet services are available in the office without interruptions", "Percentage of IT Incidents Resolved within First Attempt without the need for escalation"] },
  { id: "OBJ_ERP_IT_2", text: "ERP Upgrades & Implementations", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["ERP/IT 1 (ERP/IT Officer)"], description: ["Percentage of Successful ERP Upgrades & System Implementations"] },
  { id: "OBJ_FINANCE_ACCOUNTS_1", text: "Payment Timeliness & Accuracy", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 1 (Acc Payable)"], description: ["Ensure 100% of approved payments are processed within 24\u201372 hours of approval", "Maintain payment processing accuracy rate of 98\u2013100%", "Record zero unauthorized or duplicate payments"] },
  { id: "OBJ_FINANCE_ACCOUNTS_2", text: "Payables Management", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 1 (Acc Payable)"], description: ["Maintain 100% accurate accounts payable records", "Ensure at least 90\u201395% of vendor payments are made within agreed terms", "Keep overdue payables within acceptable thresholds"] },
  { id: "OBJ_FINANCE_ACCOUNTS_3", text: "Statutory Compliance", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 1 (Acc Payable)"], description: ["Ensure 100% timely remittance of statutory deductions (PAYE, VAT, pension, HMO, etc.)", "Maintain zero penalties arising from late or incorrect tax filings", "Ensure 100% accuracy in tax reporting and documentation"] },
  { id: "OBJ_FINANCE_ACCOUNTS_4", text: "Financial Reporting", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 1 (Acc Payable)"], description: ["Submit 100% of financial reports on schedule (weekly/monthly)", "Maintain 98\u2013100% accuracy in financial statements and payable reports"] },
  { id: "OBJ_FINANCE_ACCOUNTS_5", text: "Reconciliation & Audit Readiness", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 1 (Acc Payable)"], description: ["Complete monthly vendor reconciliations with zero unresolved discrepancies beyond one reporting cycle", "Maintain 100% audit-ready documentation for all payments and statutory remittances"] },
  { id: "OBJ_FINANCE_ACCOUNTS_6", text: "Expense Monitoring & Control", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 1 (Acc Payable)"], description: ["Identify and report at least 3\u20135 cost or process improvement opportunities annually", "Ensure 100% proper classification of transactions (approved, pending, paid)", "Perform other duties as assigned by management"] },
  { id: "OBJ_FINANCE_ACCOUNTS_7", text: "Invoicing Efficiency & Accuracy", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 2 (Acc Receivable)"], description: ["Ensure 100% of invoices are generated within 24\u201372 hours of service completion or receipt of required documentation", "Maintain invoice accuracy rate of 98\u2013100% (minimal errors or rework required)", "Ensure 100% of invoices are supported by valid PO/SES and documentation"] },
  { id: "OBJ_FINANCE_ACCOUNTS_8", text: "Receivables Collection Performance", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 2 (Acc Receivable)"], description: ["Achieve at least 85\u201395% collection of receivables within agreed credit terms", "Maintain accounts receivable aging within approved thresholds (e.g., \u226420% beyond 30 days overdue)", "Reduce overdue receivables by at least 10\u201315% annually"] },
  { id: "OBJ_FINANCE_ACCOUNTS_9", text: "Reporting Timeliness & Accuracy", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 2 (Acc Receivable)"], description: ["Submit weekly and monthly financial and receivables reports 100% on schedule", "Maintain 98\u2013100% accuracy in financial reports and receivable schedules", "Ensure monthly receivable schedules are completed within the first 5 working days of each month"] },
  { id: "OBJ_FINANCE_ACCOUNTS_10", text: "Documentation & Compliance", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 2 (Acc Receivable)"], description: ["Maintain 100% proper filing and documentation of receivables and invoice records", "Ensure zero audit queries arising from incomplete or missing documentation"] },
  { id: "OBJ_FINANCE_ACCOUNTS_11", text: "Dispute Resolution & Coordination", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 2 (Acc Receivable)"], description: ["Resolve at least 90% of invoice-related discrepancies within 5\u20137 working days", "Ensure 100% timely follow-up on outstanding customer balances"] },
  { id: "OBJ_FINANCE_ACCOUNTS_12", text: "Cash Application & Reconciliation", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 2 (Acc Receivable)"], description: ["Ensure 100% accurate posting of received payments into customer accounts", "Complete monthly customer account reconciliations with zero unresolved discrepancies beyond one reporting cycle"] },
  { id: "OBJ_FINANCE_ACCOUNTS_13", text: "Logistics & Business Reconciliation", weight: 8, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 3 (Accountant)"], description: ["Weekly reconciliation of New Era/Nets Logistics/ KHLC/ Shuttle/ Rental Bus before the close of work on Mondays", "Monthly reconciliation of New Era/Nets Logistics/ KHLC/ Shuttle/ Rental Bus before the end of the month", "Invoicing"] },
  { id: "OBJ_FINANCE_ACCOUNTS_14", text: "Invoicing & Customer Account Monitoring", weight: 8, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 3 (Accountant)"], description: ["Cycle time to prepare all invoices within 48 hours of receiving the Purchasing Order/Schedule", "Ensure monthly monitoring of customers' account details and give a report within one week", "From the invoice prepared, resolve all account payment discrepancies within 24 hours"] },
  { id: "OBJ_FINANCE_ACCOUNTS_15", text: "Financial & Fleet Expense Reporting", weight: 8, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 3 (Accountant)"], description: ["Reporting", "Prepare the weekly financial report for New Era/Nets Logistics/ KHLC/ Shuttle/ Rental", "Bus and submit before the close of work on Mondays"] },
  { id: "OBJ_FINANCE_ACCOUNTS_16", text: "Petty Cash & Imprest Disbursement", weight: 8, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 3 (Accountant)"], description: ["Prepare the weekly fleet expenses report in view of the weekly Friday fleet meetings", "Imprest", "Effective management of petty cash disbursement"] },
  { id: "OBJ_FINANCE_ACCOUNTS_17", text: "Payment Processing Speed", weight: 8, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 3 (Accountant)"], description: ["All approved payment requests must be paid within 24 hours, except on weekends"] },
  { id: "OBJ_FINANCE_ACCOUNTS_18", text: "Fuel Efficiency & Usage Tracking", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 4 (Finance Analyst)"], description: ["Achieve 5\u201310% annual reduction in fuel wastage or inefficiencies through monitoring and analysis", "Maintain 100% accurate tracking of fuel purchases and usage records", "Fuel Data Accuracy & Reporting"] },
  { id: "OBJ_FINANCE_ACCOUNTS_19", text: "Fuel Reconciliations & Consumption Analysis", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 4 (Finance Analyst)"], description: ["Ensure 100% reconciliation of fuel logs with fuel purchase records and vehicle usage reports", "Submit monthly fuel consumption reports and cost analysis within the first 5 working days of each month", "Financial Reporting Timeliness"] },
  { id: "OBJ_FINANCE_ACCOUNTS_20", text: "Financial Reporting & Analysis Accuracy", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 4 (Finance Analyst)"], description: ["Deliver 100% of scheduled financial reports and management dashboards on time", "Maintain a financial reporting accuracy rate of at least 98\u2013100%", "Operational Cost Monitoring"] },
  { id: "OBJ_FINANCE_ACCOUNTS_21", text: "Operational Cost Optimization", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 4 (Finance Analyst)"], description: ["Identify and report at least 3\u20135 cost-saving opportunities annually related to fuel usage, fleet operations, or maintenance", "Compliance Monitoring", "Conduct quarterly audits of fuel logs and maintenance documentation for all operational vehicles"] },
  { id: "OBJ_FINANCE_ACCOUNTS_22", text: "Fuel Compliance Auditing", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 4 (Finance Analyst)"], description: ["Maintain 100% documentation compliance for fuel and vehicle maintenance records", "Fleet Efficiency Monitoring", "Maintain complete fuel consumption records for 100% of operational vehicles"] },
  { id: "OBJ_FINANCE_ACCOUNTS_23", text: "Fuel Anomaly & Irregularity Detection", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 4 (Finance Analyst)"], description: ["Detect and report 100% of fuel anomalies or irregular usage patterns within 48 hours of discovery"] },
  { id: "OBJ_FINANCE_ACCOUNTS_24", text: "Operational Cost Reduction", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 5 (Head of Finance)"], description: ["Reduce operating costs by 10% across the board by Q4 through process optimization and vendor negotiations", "Cost Savings Ratio: Percentage of costs saved compared to the previous period", "Financial Management"] },
  { id: "OBJ_FINANCE_ACCOUNTS_25", text: "Liquidity & Cash Flow Management", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 5 (Head of Finance)"], description: ["Maintain a minimum cash reserve of \u20a6100 million at all times to ensure liquidity and financial stability", "Cash Flow Management", "Maintain a minimum cash reserve equivalent to 3 months of operating expenses by ensuring effective receivables and payables management every quarter"] },
  { id: "OBJ_FINANCE_ACCOUNTS_26", text: "Budget Adherence & Control", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 5 (Head of Finance)"], description: ["Budget Adherence", "Ensure 95% adherence to the annual operating budget with monthly variance analysis reports submitted by the 5th of each month", "Debt Management"] },
  { id: "OBJ_FINANCE_ACCOUNTS_27", text: "Debt Collection & Recovery", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 5 (Head of Finance)"], description: ["Reduce outstanding debts by 15% by the end of FY 2025 by improving collection efficiency and renegotiating payment terms with clients and suppliers", "Employee Development", "Ensure 80% of finance team members complete at least one professional development program related to transport finance by the end of the year"] },
  { id: "OBJ_FINANCE_ACCOUNTS_28", text: "Risk Management And Compliance", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 5 (Head of Finance)"], description: ["Risk Management and Compliance", "Implement a robust risk management framework within the next 6 months to identify, assess, and mitigate financial risks", "Achieve 100% compliance with financial regulations and laws within the next 3 months by conducting regular audits and reviews"] },
  { id: "OBJ_FINANCE_ACCOUNTS_29", text: "Reporting", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 5 (Head of Finance)"], description: ["Reporting", "Prepare and submit the weekly financial performance report (FPRs) for New Era/Nets Logistics/ KHLC/ Shuttle/ Rental Bus in the first week of the new month"] },
  { id: "OBJ_FLEET_1", text: "High Passenger Satisfaction Levels (85\u201390%)", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 1 (Bus Assistant)"], description: ["Ensure 100% compliance with passenger safety procedures", "Maintain a clean and orderly vehicle environment for every trip", "Report 100% of incidents or passenger issues promptly"] },
  { id: "OBJ_FLEET_2", text: "Driver Verification Compliance", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 2 (Fleet Officer)"], description: ["Maintain zero incidents of unverified drivers operating company vehicles", "Achieve 95% accuracy in driver and guarantor documentation and database records", "Ensure all fleet reports are submitted on schedule each month"] },
  { id: "OBJ_FLEET_3", text: "Driver Incident Reduction", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 2 (Fleet Officer)"], description: ["Reduce driver-related operational incidents by at least 10% annually through verification and monitoring"] },
  { id: "OBJ_FLEET_4", text: "Vehicle Deployment & Trip Records", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 3 (Fleet Support Officer)"], description: ["Support 95% on-time vehicle deployment for scheduled operations", "Maintain accurate daily records for 100% of vehicle assignments and trips", "Documentation & Compliance"] },
  { id: "OBJ_FLEET_5", text: "Fleet Documentation & License Compliance", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 3 (Fleet Support Officer)"], description: ["Ensure 100% validity and proper filing of fleet documentation (licenses, insurance, permits)", "Track and flag 100% of expiring documents at least 30 days before expiry", "Driver Coordination"] },
  { id: "OBJ_FLEET_6", text: "Driver Allocation & Schedule Adherence", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 3 (Fleet Support Officer)"], description: ["Maintain 100% updated driver records and assignment logs", "Ensure 95% adherence to driver schedules and trip assignments", "Fuel & Maintenance Support"] },
  { id: "OBJ_FLEET_7", text: "Fuel Management & Vehicle Servicing", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 3 (Fleet Support Officer)"], description: ["Ensure 100% proper documentation of fuel allocation records", "Support timely servicing of vehicles with at least 95% adherence to maintenance schedules", "Data Accuracy & Reporting"] },
  { id: "OBJ_FLEET_8", text: "Fleet Operational Logs & Reporting", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 3 (Fleet Support Officer)"], description: ["Maintain 98\u2013100% accuracy in fleet records and operational logs", "Submit 100% of required reports within agreed timelines", "Issue Resolution & Support"] },
  { id: "OBJ_FLEET_9", text: "Incident Escalation & Operational Resolution", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 3 (Fleet Support Officer)"], description: ["Escalate 100% of operational issues (vehicle faults, driver issues, delays) within 1\u20132 hours of identification", "Support resolution of at least 90% of routine operational issues within the same day"] },
  { id: "OBJ_FLEET_10", text: "Facility Functionality & Uptime", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 4 (Facility Manager)"], description: ["Maintain at least 95% operational uptime of all critical facility systems (electricity supply, generators, water systems, air-conditioning, and lighting)", "Ensure all facility faults are logged and addressed within 24\u201348 hours of reporting", "Keep facility-related operational disruptions below 5% per quarter"] },
  { id: "OBJ_FLEET_11", text: "Preventive Maintenance Compliance", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 4 (Facility Manager)"], description: ["Maintain accurate maintenance records for all facility equipment", "Reduce emergency maintenance incidents by at least 20% annually through preventive maintenance planning"] },
  { id: "OBJ_FLEET_12", text: "Repair Response Time", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 4 (Facility Manager)"], description: ["Ensure minor repairs are resolved within 24 hours and major repairs within 72 hours where feasible", "Maintain at least 90% on-time completion rate for repair requests"] },
  { id: "OBJ_FLEET_13", text: "Facility Cost & Resource Management", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 4 (Facility Manager)"], description: ["Maintain facility expenses within approved operational budgets each quarter", "Achieve 5\u201310% annual improvement in utility efficiency (electricity, water, fuel usage) through monitoring and optimization"] },
  { id: "OBJ_FLEET_14", text: "Safety & Compliance", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 4 (Facility Manager)"], description: ["Ensure 100% availability and accessibility of facility safety equipment (fire extinguishers, emergency exits, alarms)", "Record zero major safety violations or incidents caused by facility negligence"] },
  { id: "OBJ_FLEET_15", text: "Reporting & Documentation", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 4 (Facility Manager)"], description: ["Submit 100% of monthly facility management reports on schedule", "Ensure 100% documentation of facility-related expenses and vendor services"] },
  { id: "OBJ_FLEET_16", text: "Fleet Records Accuracy", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 5 (Fleet Maintenance North)"], description: ["30% reduction in repairs and running costs within the region", "Timeliness in reporting and resolving repair issues within 24 hours", "All-time truck availability for the client\u2019s use"] },
  { id: "OBJ_FLEET_17", text: "Fleet Utilization Rate", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 6 (Fleet Operations Manager)"], description: ["Maintain a utilization rate of at least 90% of the available fleet", "Reduce vehicle downtime to less than 5% of operational hours", "Safety, Maintenance, and Compliance"] },
  { id: "OBJ_FLEET_18", text: "Fleet Accident Reduction", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 6 (Fleet Operations Manager)"], description: ["Reduce accident rate by 20% within the next 12 months", "Achieve 100% compliance with all regulatory transport requirements within the next 6 months by conducting regular audits", "Ensure 100% adherence to scheduled maintenance for all vehicles"] },
  { id: "OBJ_FLEET_19", text: "Operational Efficiency", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 6 (Fleet Operations Manager)"], description: ["Operational Efficiency", "Increase the on-time delivery rate by 15% within the year by optimizing routes and providing driver training", "Employee Management and Development"] },
  { id: "OBJ_FLEET_20", text: "Operations Team Professional Development", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 6 (Fleet Operations Manager)"], description: ["Ensure \u2265 80% of the operation team members complete at least one professional development program related to transport by December 2025", "Retain at least 85% of drivers annually", "Budget Management"] },
  { id: "OBJ_FLEET_21", text: "Marketing Budget Compliance", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 6 (Fleet Operations Manager)"], description: ["Percentage compliance with the allocated marketing budget with a variance of no more than 5%", "Business Growth", "Achieve a 15% year-over-year growth in revenue from logistics operations"] },
  { id: "OBJ_FLEET_22", text: "Client Retention & Service Delivery", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 6 (Fleet Operations Manager)"], description: ["Retain 90% of existing clients annually through excellent service delivery", "Corporate Bus Deployment", "Achieve 100% deployment of staff buses for corporate use before the end of Q4 of the current year"] },
  { id: "OBJ_FLEET_23", text: "Shuttle Fleet Deployment & Scale", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 6 (Fleet Operations Manager)"], description: ["Deploy and maintain a fleet of at least 50 buses for shuttle services between your assigned region before the end of Q4 of the current year"] },
  { id: "OBJ_FLEET_24", text: "Incident Report Submission Speed", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 7 (HSE Executive)"], description: ["Incidence report submission not more than 12 hours after the occurrence", "Monthly incidence rate and near miss not more than 2", "100% availability of First Aid box items at all times"] },
  { id: "OBJ_FLEET_25", text: "HSE Incident Action Closure", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 7 (HSE Executive)"], description: ["Corrective action closure plans submission within 24 hours of incidence", "80% all time customer satisfaction majorly from driver performance metrics", "Zero tolerance for security breaches or theft incidents"] },
  { id: "OBJ_FLEET_26", text: "JCC Preparation & Sign-off", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Prepare JCC for intervention and other in-house repairs within 24 hours of disbursement of funds"] },
  { id: "OBJ_FLEET_27", text: "Document Renewal & Record Keeping", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Ensure that driver particulars, such as licenses, etc., are renewed monthly"] },
  { id: "OBJ_FLEET_28", text: "Driver Welfare & Grievance Resolution", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Weekly feedback report on driver competency and welfare", "Reduce maintenance costs by 15% within the next 12 months, optimizing maintenance schedules and procedures"] },
  { id: "OBJ_FLEET_29", text: "Regulatory Compliance & Deadlines", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Maintain 100% regulatory compliance, ensuring that all vehicles and drivers meet relevant laws and regulations within the next 12 months"] },
  { id: "OBJ_FLEET_30", text: "Monthly Operational Reporting", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Prepare A Monthly Report And Submit It On Or Before The 25Th Of Each Month"] },
  { id: "OBJ_FLEET_31", text: "Quarterly Compliance Audit & Reporting", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Quarterly Compliance Audit & Reporting"] },
  { id: "OBJ_FLEET_32", text: "Weekly Incident Reporting", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Complete Incident Report Weekly On Mondays"] },
  { id: "OBJ_HUMAN_RESOURCES_7", text: "Employee Grievance Resolution", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Resolve 90% of employee grievances within 5 working days within the next 6 months", "Achieve a conflict resolution rate of 90% or better, with no unresolved conflicts lasting more than 30 days within the next 12 months", "Performance Management"] },
  { id: "OBJ_HUMAN_RESOURCES_8", text: "Performance Review Compliance", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Ensuring 100% compliance regarding the quarterly performance review", "Execution of the result of the bi-annual performance appraisal on or before the 2nd week of the next half-year", "Recruitment and Retention"] },
  { id: "OBJ_HUMAN_RESOURCES_9", text: "Staff Turnover Reduction", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Reduce the overall employee turnover rate to 10% or less within the next 12 months", "Time-to-Hire: Reduce average time (2months) taken to fill open positions within the next 12months", "Onboarding: Within one week of resumption"] },
  { id: "OBJ_HUMAN_RESOURCES_10", text: "Confirmation Letter Distribution", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Ensure employees receive confirmation letters by the first week of the 7th month", "Payroll Management and Statutory Compliance", "Achieve a payroll accuracy rate of 99.5% or better, with no more than 0.5% errors in payroll processing within the next 6 months"] },
  { id: "OBJ_HUMAN_RESOURCES_11", text: "Statutory Payments & Payroll Processing", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Ensure a monthly schedule of all (Pension, Tax, NSITF, etc.) statutory payments on or before the last day of every month", "Ensure submission of payroll approval for salaries on the 22nd of the month", "Ensure payment of monthly salaries on the 26th of the month for all staff and on the 24th for NBC"] },
  { id: "OBJ_HUMAN_RESOURCES_12", text: "Employee Engagement & Satisfaction", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Employee Engagement and Satisfaction", "Bi-annual Execution of Employee Satisfaction Survey \u2013 Timeline 3weeks", "Ensure 75% participation rate in the surveys"] },
  { id: "OBJ_HUMAN_RESOURCES_13", text: "Employee Engagement & Satisfaction", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Achieve a 75% engagement score by the end of the year", "Exit Management", "Average Time-to-Exit: Average time taken to complete the exit process"] },
  { id: "OBJ_HUMAN_RESOURCES_14", text: "Exit Process Completion Rate", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Exit Process Completion Rate: Percentage of exit processes completed within a specified timeframe"] },
  { id: "OBJ_HUMAN_RESOURCES_15", text: "Employee Grievance Resolution", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 2 (HR Executive 2)"], description: ["Resolve 90% of employee grievances within 5 working days within the next 6 months", "Achieve a conflict resolution rate of 90% or better, with no unresolved conflicts lasting more than 30 days within the next 12 months", "Performance Management"] },
  { id: "OBJ_HUMAN_RESOURCES_16", text: "Performance Review Compliance", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 2 (HR Executive 2)"], description: ["Ensuring 100% compliance regarding the quarterly performance review", "Execution of the result of the bi-annual performance appraisal on or before the 2nd week of the next half-year", "Recruitment and Retention"] },
  { id: "OBJ_HUMAN_RESOURCES_17", text: "Staff Turnover Reduction", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 2 (HR Executive 2)"], description: ["Reduce the overall employee turnover rate to 10% or less within the next 12 months", "Time-to-Hire: Reduce average time (2months) taken to fill open positions within the next 12months", "Onboarding: Within one week of resumption"] },
  { id: "OBJ_HUMAN_RESOURCES_18", text: "Confirmation Letter Distribution", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 2 (HR Executive 2)"], description: ["Ensure employees receive confirmation letters by the first week of the 7th month", "Payroll Management and Statutory Compliance", "Achieve a payroll accuracy rate of 99.5% or better, with no more than 0.5% errors in payroll processing within the next 6 months"] },
  { id: "OBJ_HUMAN_RESOURCES_19", text: "Statutory Payments & Payroll Processing", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 2 (HR Executive 2)"], description: ["Ensure a monthly schedule of all (Pension, Tax, NSITF, etc.) statutory payments on or before the last day of every month", "Ensure submission of payroll approval for salaries on the 22nd of the month", "Ensure payment of monthly salaries on the 26th of the month for all staff and on the 24th for NBC"] },
  { id: "OBJ_HUMAN_RESOURCES_20", text: "Employee Engagement & Satisfaction", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 2 (HR Executive 2)"], description: ["Employee Engagement and Satisfaction", "Bi-annual Execution of Employee Satisfaction Survey \u2013 Timeline 3weeks", "Ensure 75% participation rate in the surveys"] },
  { id: "OBJ_HUMAN_RESOURCES_21", text: "Employee Engagement & Satisfaction", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 2 (HR Executive 2)"], description: ["Achieve an 75% engagement score by the end of the year", "Exit Management", "Average Time-to-Exit: Average time taken to complete the exit process"] },
  { id: "OBJ_HUMAN_RESOURCES_22", text: "Exit Process Completion Rate", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 2 (HR Executive 2)"], description: ["Exit Process Completion Rate: Percentage of exit processes completed within a specified timeframe"] },
  { id: "OBJ_HUMAN_RESOURCES_23", text: "Employee Engagement", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 3 (Head of HR)"], description: ["Increase employee engagement score by 10% as measured by an annual employee satisfaction survey", "Reduce employee turnover rate by 5% year-over-year", "Increase the number of employees receiving formal recognition for their contributions by 20%."] },
  { id: "OBJ_HUMAN_RESOURCES_24", text: "Learning and Manpower Development", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 3 (Head of HR)"], description: ["Training Completion Rate: Achieve a 95% employee participation rate in mandatory training programs (e.g., safety, compliance)", "Employee Skill Improvement: Measured through assessments before and after training", "Achieve a 95% utilization rate of the allocated L&D budget", "%tage number of quarterly trainings for external clients (in collaboration with LASTMA, FRSC) etc executed"] },
  { id: "OBJ_HUMAN_RESOURCES_25", text: "Strategic Workforce Management", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 3 (Head of HR)"], description: ["Workforce Planning Accuracy: Percentage accuracy of forecasting workforce needs across the group.", "Succession Planning Coverage: Percentage of key roles with identified successors ready within a set timeframe."] },
  { id: "OBJ_HUMAN_RESOURCES_26", text: "Oversee Performance Management Process", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 3 (Head of HR)"], description: ["Ensuring 100% compliance regarding quarterly performance review", "Execution of result of bi-annual performance appraisal on or before the 2nd week of the next half year"] },
  { id: "OBJ_HUMAN_RESOURCES_27", text: "Recruitment and Retention at the Group Level", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 3 (Head of HR)"], description: ["Group-Wide Turnover Rate: Aggregate employee turnover across all business units", "Diversity and Inclusion Metrics: Percentage representation of diverse groups in leadership and across the organization."] },
  { id: "OBJ_HUMAN_RESOURCES_28", text: "Health, Safety, and Well-Being", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 3 (Head of HR)"], description: ["Group Incident Reduction Rate: Reduction in workplace incidents across the group by 0% - 5%", "Employee Well-Being Participation: Percentage of employees engaging in group-wide wellness programs", "Health and Safety Audit Compliance: Percentage of units compliant with health and safety regulations."] },
  { id: "OBJ_HUMAN_RESOURCES_29", text: "HR Operational Efficiency", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 3 (Head of HR)"], description: ["HR Budget Utilization: Percentage of the HR budget effectively used.", "Policy Update Frequency: Ensuring policies are updated on schedule to match industry standards and legal requirements."] },
  { id: "OBJ_OTHER_1", text: "Service Delivery & Timeliness", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Head of Operations"], description: ["Ensure 95% on-time service delivery for scheduled operations", "Reduce vehicle downtime to less than 10% per month", "Ensure 100% compliance with operational safety and regulatory standards"] },
  { id: "OBJ_OTHER_2", text: "Operational Staff Policy Compliance", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Head of Operations"], description: ["Achieve 90%+ operational staff performance compliance with company policies"] },
  { id: "OBJ_INTERNAL_CONTROL_1", text: "Completing Audit Reports", weight: 14, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Internal Control 1 (Internal Control)"], description: ["Completing Audit Reports", "Cycle time for completing Draft Audit Reports", "Cycle time for completing Final Audit Reports"] },
  { id: "OBJ_INTERNAL_CONTROL_2", text: "Audit Accuracy & Fraud Detection", weight: 13, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Internal Control 1 (Internal Control)"], description: ["Number of cases of fraud issues detected by 3rd parties (External Auditors) during audit exercises (but not detected by Internal Auditors)", "Percentage of transport-related regulations and laws complied with", "Percentage of reports completed within timelines"] },
  { id: "OBJ_INTERNAL_CONTROL_3", text: "Asset Utilization Optimization", weight: 13, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Internal Control 1 (Internal Control)"], description: ["Percentage of Optimal Asset Utilization"] },
  { id: "OBJ_LEGAL_1", text: "Regulatory Compliance & Deadlines", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Legal 1 (Legal Counsel & EA)"], description: ["Maintain 100% compliance with required regulatory filings and legal documentation deadlines", "Achieve 95%+ timeliness in responding to executive and legal requests", "Ensure accurate documentation and secure handling of confidential information"] },
  { id: "OBJ_LEGAL_2", text: "Executive Action Item Follow-Up", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Legal 1 (Legal Counsel & EA)"], description: ["Provide timely coordination and follow-up on executive action items"] },
  { id: "OBJ_LEGAL_3", text: "Contract Review Efficiency", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Legal 2 (Legal Counsel)"], description: ["Reduce the average contract review time to 3 business days or less within the next 12 months", "Cycle time for drafting agreements", "Maintain a draft accuracy rate of 95% or better, with no material errors, within the next 12 months"] },
  { id: "OBJ_LEGAL_4", text: "Legal Document Drafting Speed", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Legal 2 (Legal Counsel)"], description: ["Reviewing contracts and drafting legal documents within 24 hours of receiving the request", "Risk Management and Compliance", "Reduce potential legal exposure by 10 \u2013 15% annually through proactive measures"] },
  { id: "OBJ_LEGAL_5", text: "Regulatory Compliance & Deadlines", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Legal 2 (Legal Counsel)"], description: ["Maintain a regulatory compliance rate of 100%, with no material fines or penalties within the next 12 months", "Policy and Procedure Updates", "Quarterly review of policy document to ensure 100% adherence to relevant laws and regulations"] },
  { id: "OBJ_LEGAL_6", text: "Legislative Policy Drafting Speed", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Legal 2 (Legal Counsel)"], description: ["Draft new company policy documents that are in line with new legislative laws within 5 working days", "Reporting and Document Management", "Submit an accurate weekly/ activity report before the close of business on Fridays"] },
  { id: "OBJ_LEGAL_7", text: "Quarterly Compliance Audit & Reporting", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Legal 2 (Legal Counsel)"], description: ["Submit an accurate quarterly report before the quarterly review", "Conduct quarterly audit and maintenance of legal documents with a 90% accuracy", "Maintain accurate and up-to-date documents and records, with 100% compliance with document management policies within the next 6 months"] },
  { id: "OBJ_LEGAL_8", text: "Legal Counsel", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Legal 2 (Legal Counsel)"], description: ["Legal Counsel", "Represent the company periodically in legal proceedings/meetings"] },
  { id: "OBJ_MARKETING_1", text: "Marketing Revenue Growth", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 1 (Head of Marketing)"], description: ["Achieve at least 25\u201335% annual growth in marketing-generated revenue across business units", "Ensure a minimum of 40\u201350% of total company leads originate from marketing activities", "Lead Generation & Conversion"] },
  { id: "OBJ_MARKETING_2", text: "Qualified Lead Generation", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 1 (Head of Marketing)"], description: ["Increase qualified lead generation by at least 20\u201330% annually", "Maintain lead-to-customer conversion rate of at least 10\u201320% in collaboration with the sales team", "Brand Visibility & Engagement"] },
  { id: "OBJ_MARKETING_3", text: "Social Media Reach & Analytics", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 1 (Head of Marketing)"], description: ["Achieve a minimum of 30% annual growth in social media reach and engagement across platforms", "Increase website traffic by at least 25% year-on-year", "Maintain consistent brand presence across all major marketing channels"] },
  { id: "OBJ_MARKETING_4", text: "Campaign Performance", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 1 (Head of Marketing)"], description: ["Campaign Performance", "Deliver 90\u201395% of marketing campaigns on schedule and within approved budgets", "Ensure minimum ROI ratio of 3:1 on major marketing campaigns (where measurable)"] },
  { id: "OBJ_MARKETING_5", text: "Team Performance & Productivity", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 1 (Head of Marketing)"], description: ["Team Performance & Productivity", "Ensure 100% completion of marketing team performance reviews annually", "Maintain high team productivity and campaign output across marketing staff"] },
  { id: "OBJ_MARKETING_6", text: "Marketing Objectives Completion Rate", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 1 (Head of Marketing)"], description: ["Achieve 90%+ completion rate of departmental marketing objectives each quarter"] },
  { id: "OBJ_MARKETING_7", text: "Customer Satisfaction & Inquiry Management", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 2 (Marketing Executive & CSR)"], description: ["Maintain customer satisfaction rating of 85\u201390% or higher (where feedback is collected)", "Ensure 100% accurate logging of customer enquiries and leads", "Support generation of qualified leads through marketing interactions and follow-ups"] },
  { id: "OBJ_MARKETING_8", text: "Client Communications Quality", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 2 (Marketing Executive & CSR)"], description: ["Maintain professional and courteous communication with all customers"] },
  { id: "OBJ_MARKETING_9", text: "Digital Engagement & Campaign Performance", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 3 (Marketing Executive)"], description: ["Growth in marketing-generated leads and customer enquiries", "Engagement performance across digital platforms", "Contribution of marketing activities to sales and brand visibility"] },
  { id: "OBJ_MARKETING_10", text: "Brand Visibility & Campaign Quality", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 3 (Marketing Executive)"], description: ["Timely delivery and quality of marketing materials and campaigns"] },
  { id: "OBJ_MARKETING_11", text: "Marketing Campaign Execution", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 4 (Marketing Manager)"], description: ["Successful execution of marketing campaigns within agreed timelines and budgets", "Improvement in brand visibility and engagement across marketing platforms", "Contribution of marketing initiatives to sales, enrollment, and revenue growth"] },
  { id: "OBJ_MARKETING_12", text: "Marketing Team Productivity", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 4 (Marketing Manager)"], description: ["Performance and productivity of the marketing team"] },
  { id: "OBJ_MARKETING_13", text: "Social Media Reach & Analytics", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 5 (Social Media Executive)"], description: ["Respond to 95% of social media enquiries within 24 hours", "Ensure all posts adhere to brand guidelines and are published as scheduled (100%)", "Track campaign results and deliver monthly reports with actionable insights"] },
  { id: "OBJ_MARKETING_14", text: "Social Media Reach & Analytics", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 5 (Social Media Executive)"], description: ["Generate at least 10 qualified customer leads per month from social media interactions"] },
  { id: "OBJ_MARKETING_15", text: "Sales Deal Closure", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 6 (Sales Closer)"], description: ["Revenue generated across business units", "Lead-to-sale conversion rate (This will be based on the amount communicated per time)", "Client retention, repeat business, and referrals"] },
  { id: "OBJ_NOC_1", text: "Fleet Visibility & Monitoring", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 1 (Fleet Monitoring & NOC Supervisor)"], description: ["Maintain 100% real-time tracking visibility for all active fleet vehicles", "Ensure all vehicle movements are logged and monitored without gaps"] },
  { id: "OBJ_NOC_2", text: "Driver Compliance", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 1 (Fleet Monitoring & NOC Supervisor)"], description: ["Detect and report 100% of major driver violations (speeding, route deviation, unauthorized stops)", "Achieve at least 90\u201395% driver compliance with approved routes and policies"] },
  { id: "OBJ_NOC_3", text: "Incident Response", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 1 (Fleet Monitoring & NOC Supervisor)"], description: ["Ensure 100% of incidents are reported and escalated within 10\u201315 minutes of detection", "Maintain complete and accurate incident logs for all reported cases"] },
  { id: "OBJ_NOC_4", text: "Fuel Monitoring Support", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 1 (Fleet Monitoring & NOC Supervisor)"], description: ["Identify and report 100% of fuel anomalies within 24 hours", "Support reduction of fuel-related inefficiencies by 5\u201310% annually"] },
  { id: "OBJ_NOC_5", text: "Reporting & Data Accuracy", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 1 (Fleet Monitoring & NOC Supervisor)"], description: ["Submit 100% of required monitoring reports on schedule", "Maintain data accuracy rate of at least 98\u2013100% across monitoring logs and reports"] },
  { id: "OBJ_NOC_6", text: "Team Performance", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 1 (Fleet Monitoring & NOC Supervisor)"], description: ["Ensure 100% NOC shift coverage as scheduled", "Achieve at least 90% adherence to monitoring and escalation procedures by team members"] },
  { id: "OBJ_NOC_7", text: "Vehicle Utilization & Efficiency", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Fleet Utilization Rate: Increased by 30% Percent due to proper monitoring and frequent call outs", "30% Reduction in Idle Time: Decrease in unnecessary vehicle idling time"] },
  { id: "OBJ_NOC_8", text: "Driver Performance & Safety", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Driver Compliance Rate: Increase the number of averted risks due to call-outs", "Number of Violations: Reduce cases of speeding, harsh braking, and long parking"] },
  { id: "OBJ_NOC_9", text: "Reporting & Monitoring Accuracy", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Report Timeliness: Percentage of reports submitted on time (daily, weekly, monthly)", "Data Accuracy Rate: Accuracy and reliability of fleet reports generated", "Incident Reporting Response Time: Average time taken to detect and escalate issues"] },
  { id: "OBJ_NOC_10", text: "Alarm Detection & Monitoring", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Alarm Detection & Monitoring"] },
  { id: "OBJ_WORKSHOP_1", text: "Repair Quality & Accuracy", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Workshop 1 (Mechanic)"], description: ["Ensure vehicle servicing tasks are completed within scheduled timelines", "Contribute to maintaining fleet availability above 90%", "Maintain 100% compliance with workshop safety procedures"] },
  { id: "OBJ_WORKSHOP_2", text: "Workshop Safety & Compliance", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Workshop 2 (Workshop Assistant)"], description: ["Support completion of 95% of assigned workshop tasks within expected timelines", "Ensure daily cleanliness and proper organization of workshop space", "Record zero safety incidents caused by negligence"] },
  { id: "OBJ_WORKSHOP_3", text: "Repair Turnaround Time & Availability", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Workshop 3 (Workshop Manager)"], description: ["Quality of completed jobs and reduction in repeat faults", "Ensure fleet and workshop equipment availability remains at or above 90%", "Ensure 100% compliance with safety and maintenance standards"] },
  { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"] },
  { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"] },
  { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"] },
  { id: "OBJ_KHLC_SKILLUP_4", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 2 (Supervisor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"] },
  { id: "OBJ_KHLC_SKILLUP_5", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 2 (Supervisor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"] },
  { id: "OBJ_KHLC_SKILLUP_6", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 2 (Supervisor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"] },
  { id: "OBJ_KHLC_SKILLUP_7", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 3 (Program Coordinator)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"] },
  { id: "OBJ_KHLC_SKILLUP_8", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 3 (Program Coordinator)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"] },
  { id: "OBJ_KHLC_SKILLUP_9", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 3 (Program Coordinator)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"] },
  { id: "OBJ_KHLC_SKILLUP_10", text: "Stakeholder Relationships", weight: 8, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 4 (Admin Officer)"], description: ["Achieve an average stakeholder relationship rating of 4/5 or higher (>=90%)"] },
  { id: "OBJ_KHLC_SKILLUP_11", text: "Professional Compliance", weight: 8, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 4 (Admin Officer)"], description: ["Ensure a compliance rate of 100% with regards to professionalism from all instructors, supervisor"] },
  { id: "OBJ_KHLC_SKILLUP_12", text: "Client Invoicing", weight: 8, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 4 (Admin Officer)"], description: ["Ensure accurate invoicing of clients on or before 5th week of the term"] },
  { id: "OBJ_KHLC_SKILLUP_13", text: "Receivables Management", weight: 8, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 4 (Admin Officer)"], description: ["Ensure 85% – 90% receivables of all client invoices before 11th week of the term"] },
  { id: "OBJ_KHLC_SKILLUP_14", text: "Reporting and Documentation", weight: 8, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 4 (Admin Officer)"], description: ["Submit accurate quarterly report before end of term", "Ensure 100% of documents are filed (physical and digital) in the appropriate systems within 24 hours of receipt, maintaining 98% accuracy."] },
  { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"] },
  { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"] },
  { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"] },
  { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"] },
  { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"] },
  { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"] }
];

const INITIAL_REVIEWS: PerformanceReview[] = [
  {
    id: "REV001",
    employeeId: "260305",
    employeeName: "Asiegbu  Chioma John",
    department: "Marketing 2 (Marketing Executive & CSR)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_MARKETING_7", text: "Customer Satisfaction & Inquiry Management", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 2 (Marketing Executive & CSR)"], description: ["Maintain customer satisfaction rating of 85\u201390% or higher (where feedback is collected)", "Ensure 100% accurate logging of customer enquiries and leads", "Support generation of qualified leads through marketing interactions and follow-ups"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_MARKETING_8", text: "Client Communications Quality", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 2 (Marketing Executive & CSR)"], description: ["Maintain professional and courteous communication with all customers"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV002",
    employeeId: "260307",
    employeeName: "Iheukwumere Friday Kelechi",
    department: "Fleet 8 (Fleet Supervisor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_26", text: "JCC Preparation & Sign-off", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Prepare JCC for intervention and other in-house repairs within 24 hours of disbursement of funds"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_27", text: "Document Renewal & Record Keeping", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Ensure that driver particulars, such as licenses, etc., are renewed monthly"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_28", text: "Driver Welfare & Grievance Resolution", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Weekly feedback report on driver competency and welfare", "Reduce maintenance costs by 15% within the next 12 months, optimizing maintenance schedules and procedures"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_29", text: "Regulatory Compliance & Deadlines", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Maintain 100% regulatory compliance, ensuring that all vehicles and drivers meet relevant laws and regulations within the next 12 months"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_30", text: "Monthly Operational Reporting", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Prepare A Monthly Report And Submit It On Or Before The 25Th Of Each Month"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_31", text: "Quarterly Compliance Audit & Reporting", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Quarterly Compliance Audit & Reporting"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_32", text: "Weekly Incident Reporting", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Complete Incident Report Weekly On Mondays"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV003",
    employeeId: "260308",
    employeeName: "Tumie Johnson Ekanmbakumo",
    department: "Fleet 2 (Fleet Officer)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_2", text: "Driver Verification Compliance", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 2 (Fleet Officer)"], description: ["Maintain zero incidents of unverified drivers operating company vehicles", "Achieve 95% accuracy in driver and guarantor documentation and database records", "Ensure all fleet reports are submitted on schedule each month"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_3", text: "Driver Incident Reduction", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 2 (Fleet Officer)"], description: ["Reduce driver-related operational incidents by at least 10% annually through verification and monitoring"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV004",
    employeeId: "260309",
    employeeName: "Chidimma Maureen Uzoukwu",
    department: "NOC 1 (Fleet Monitoring & NOC Supervisor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_1", text: "Fleet Visibility & Monitoring", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 1 (Fleet Monitoring & NOC Supervisor)"], description: ["Maintain 100% real-time tracking visibility for all active fleet vehicles", "Ensure all vehicle movements are logged and monitored without gaps"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_2", text: "Driver Compliance", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 1 (Fleet Monitoring & NOC Supervisor)"], description: ["Detect and report 100% of major driver violations (speeding, route deviation, unauthorized stops)", "Achieve at least 90\u201395% driver compliance with approved routes and policies"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_3", text: "Incident Response", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 1 (Fleet Monitoring & NOC Supervisor)"], description: ["Ensure 100% of incidents are reported and escalated within 10\u201315 minutes of detection", "Maintain complete and accurate incident logs for all reported cases"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_4", text: "Fuel Monitoring Support", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 1 (Fleet Monitoring & NOC Supervisor)"], description: ["Identify and report 100% of fuel anomalies within 24 hours", "Support reduction of fuel-related inefficiencies by 5\u201310% annually"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_5", text: "Reporting & Data Accuracy", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 1 (Fleet Monitoring & NOC Supervisor)"], description: ["Submit 100% of required monitoring reports on schedule", "Maintain data accuracy rate of at least 98\u2013100% across monitoring logs and reports"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_6", text: "Team Performance", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 1 (Fleet Monitoring & NOC Supervisor)"], description: ["Ensure 100% NOC shift coverage as scheduled", "Achieve at least 90% adherence to monitoring and escalation procedures by team members"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV005",
    employeeId: "260310",
    employeeName: "Aremu Abiodun Najeem",
    department: "Fleet 8 (Fleet Supervisor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_26", text: "JCC Preparation & Sign-off", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Prepare JCC for intervention and other in-house repairs within 24 hours of disbursement of funds"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_27", text: "Document Renewal & Record Keeping", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Ensure that driver particulars, such as licenses, etc., are renewed monthly"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_28", text: "Driver Welfare & Grievance Resolution", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Weekly feedback report on driver competency and welfare", "Reduce maintenance costs by 15% within the next 12 months, optimizing maintenance schedules and procedures"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_29", text: "Regulatory Compliance & Deadlines", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Maintain 100% regulatory compliance, ensuring that all vehicles and drivers meet relevant laws and regulations within the next 12 months"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_30", text: "Monthly Operational Reporting", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Prepare A Monthly Report And Submit It On Or Before The 25Th Of Each Month"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_31", text: "Quarterly Compliance Audit & Reporting", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Quarterly Compliance Audit & Reporting"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_32", text: "Weekly Incident Reporting", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Complete Incident Report Weekly On Mondays"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV006",
    employeeId: "260311",
    employeeName: "Babalola Imoleayo Adelakun",
    department: "Fleet 8 (Fleet Supervisor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_26", text: "JCC Preparation & Sign-off", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Prepare JCC for intervention and other in-house repairs within 24 hours of disbursement of funds"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_27", text: "Document Renewal & Record Keeping", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Ensure that driver particulars, such as licenses, etc., are renewed monthly"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_28", text: "Driver Welfare & Grievance Resolution", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Weekly feedback report on driver competency and welfare", "Reduce maintenance costs by 15% within the next 12 months, optimizing maintenance schedules and procedures"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_29", text: "Regulatory Compliance & Deadlines", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Maintain 100% regulatory compliance, ensuring that all vehicles and drivers meet relevant laws and regulations within the next 12 months"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_30", text: "Monthly Operational Reporting", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Prepare A Monthly Report And Submit It On Or Before The 25Th Of Each Month"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_31", text: "Quarterly Compliance Audit & Reporting", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Quarterly Compliance Audit & Reporting"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_32", text: "Weekly Incident Reporting", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Complete Incident Report Weekly On Mondays"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV007",
    employeeId: "260312",
    employeeName: "Oluwasijibomi Ebenezer Akinsohun",
    department: "Fleet 8 (Fleet Supervisor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_26", text: "JCC Preparation & Sign-off", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Prepare JCC for intervention and other in-house repairs within 24 hours of disbursement of funds"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_27", text: "Document Renewal & Record Keeping", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Ensure that driver particulars, such as licenses, etc., are renewed monthly"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_28", text: "Driver Welfare & Grievance Resolution", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Weekly feedback report on driver competency and welfare", "Reduce maintenance costs by 15% within the next 12 months, optimizing maintenance schedules and procedures"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_29", text: "Regulatory Compliance & Deadlines", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Maintain 100% regulatory compliance, ensuring that all vehicles and drivers meet relevant laws and regulations within the next 12 months"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_30", text: "Monthly Operational Reporting", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Prepare A Monthly Report And Submit It On Or Before The 25Th Of Each Month"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_31", text: "Quarterly Compliance Audit & Reporting", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Quarterly Compliance Audit & Reporting"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_32", text: "Weekly Incident Reporting", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Complete Incident Report Weekly On Mondays"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV008",
    employeeId: "260314",
    employeeName: "Esther Victor Obilor",
    department: "Finance 3 (Accountant)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_13", text: "Logistics & Business Reconciliation", weight: 8, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 3 (Accountant)"], description: ["Weekly reconciliation of New Era/Nets Logistics/ KHLC/ Shuttle/ Rental Bus before the close of work on Mondays", "Monthly reconciliation of New Era/Nets Logistics/ KHLC/ Shuttle/ Rental Bus before the end of the month", "Invoicing"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_14", text: "Invoicing & Customer Account Monitoring", weight: 8, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 3 (Accountant)"], description: ["Cycle time to prepare all invoices within 48 hours of receiving the Purchasing Order/Schedule", "Ensure monthly monitoring of customers' account details and give a report within one week", "From the invoice prepared, resolve all account payment discrepancies within 24 hours"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_15", text: "Financial & Fleet Expense Reporting", weight: 8, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 3 (Accountant)"], description: ["Reporting", "Prepare the weekly financial report for New Era/Nets Logistics/ KHLC/ Shuttle/ Rental", "Bus and submit before the close of work on Mondays"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_16", text: "Petty Cash & Imprest Disbursement", weight: 8, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 3 (Accountant)"], description: ["Prepare the weekly fleet expenses report in view of the weekly Friday fleet meetings", "Imprest", "Effective management of petty cash disbursement"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_17", text: "Payment Processing Speed", weight: 8, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 3 (Accountant)"], description: ["All approved payment requests must be paid within 24 hours, except on weekends"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV009",
    employeeId: "260315",
    employeeName: "Ochiabuto Chinonso Sophia",
    department: "Marketing 5 (Social Media Executive)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_MARKETING_13", text: "Social Media Reach & Analytics", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 5 (Social Media Executive)"], description: ["Respond to 95% of social media enquiries within 24 hours", "Ensure all posts adhere to brand guidelines and are published as scheduled (100%)", "Track campaign results and deliver monthly reports with actionable insights"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_MARKETING_14", text: "Social Media Reach & Analytics", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 5 (Social Media Executive)"], description: ["Generate at least 10 qualified customer leads per month from social media interactions"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV010",
    employeeId: "260316",
    employeeName: "Kennedy Chukwudi Salvation",
    department: "Fleet 1 (Bus Assistant)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_1", text: "High Passenger Satisfaction Levels (85\u201390%)", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 1 (Bus Assistant)"], description: ["Ensure 100% compliance with passenger safety procedures", "Maintain a clean and orderly vehicle environment for every trip", "Report 100% of incidents or passenger issues promptly"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV011",
    employeeId: "260317",
    employeeName: "Opeyemi Ismaila",
    department: "Admin/HR 1 (Front Desk & Account Support)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_1", text: "Visitor Management & Professional Appearance", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Admin/HR 1 (Front Desk & Account Support)"], description: ["Maintain 100% accurate front desk and visitor records", "Ensure financial documentation accuracy above 98%", "Provide timely administrative support for finance operations"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_2", text: "Front Desk Office Supplies & Task Execution", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Admin/HR 1 (Front Desk & Account Support)"], description: ["Ensure 100% professional demeanour and appearance at all times", "Timeliness in restocking of office supplies"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV012",
    employeeId: "260318",
    employeeName: "Adefehintoye Adedeji",
    department: "Fleet 8 (Fleet Supervisor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_26", text: "JCC Preparation & Sign-off", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Prepare JCC for intervention and other in-house repairs within 24 hours of disbursement of funds"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_27", text: "Document Renewal & Record Keeping", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Ensure that driver particulars, such as licenses, etc., are renewed monthly"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_28", text: "Driver Welfare & Grievance Resolution", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Weekly feedback report on driver competency and welfare", "Reduce maintenance costs by 15% within the next 12 months, optimizing maintenance schedules and procedures"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_29", text: "Regulatory Compliance & Deadlines", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Maintain 100% regulatory compliance, ensuring that all vehicles and drivers meet relevant laws and regulations within the next 12 months"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_30", text: "Monthly Operational Reporting", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Prepare A Monthly Report And Submit It On Or Before The 25Th Of Each Month"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_31", text: "Quarterly Compliance Audit & Reporting", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Quarterly Compliance Audit & Reporting"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_32", text: "Weekly Incident Reporting", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Complete Incident Report Weekly On Mondays"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV013",
    employeeId: "260319",
    employeeName: "Odubiyi Oluwaseun",
    department: "Fleet 1 (Bus Assistant)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_1", text: "High Passenger Satisfaction Levels (85\u201390%)", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 1 (Bus Assistant)"], description: ["Ensure 100% compliance with passenger safety procedures", "Maintain a clean and orderly vehicle environment for every trip", "Report 100% of incidents or passenger issues promptly"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV014",
    employeeId: "260320",
    employeeName: "Helen Ajoke John",
    department: "Fleet 1 (Bus Assistant)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_1", text: "High Passenger Satisfaction Levels (85\u201390%)", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 1 (Bus Assistant)"], description: ["Ensure 100% compliance with passenger safety procedures", "Maintain a clean and orderly vehicle environment for every trip", "Report 100% of incidents or passenger issues promptly"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV015",
    employeeId: "260321",
    employeeName: "Akanbi Latifat Omolade",
    department: "Fleet 8 (Fleet Supervisor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_26", text: "JCC Preparation & Sign-off", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Prepare JCC for intervention and other in-house repairs within 24 hours of disbursement of funds"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_27", text: "Document Renewal & Record Keeping", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Ensure that driver particulars, such as licenses, etc., are renewed monthly"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_28", text: "Driver Welfare & Grievance Resolution", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Weekly feedback report on driver competency and welfare", "Reduce maintenance costs by 15% within the next 12 months, optimizing maintenance schedules and procedures"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_29", text: "Regulatory Compliance & Deadlines", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Maintain 100% regulatory compliance, ensuring that all vehicles and drivers meet relevant laws and regulations within the next 12 months"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_30", text: "Monthly Operational Reporting", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Prepare A Monthly Report And Submit It On Or Before The 25Th Of Each Month"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_31", text: "Quarterly Compliance Audit & Reporting", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Quarterly Compliance Audit & Reporting"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_32", text: "Weekly Incident Reporting", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 8 (Fleet Supervisor)"], description: ["Complete Incident Report Weekly On Mondays"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV016",
    employeeId: "260322",
    employeeName: "Fatai Adebule",
    department: "Fleet 1 (Bus Assistant)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_1", text: "High Passenger Satisfaction Levels (85\u201390%)", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 1 (Bus Assistant)"], description: ["Ensure 100% compliance with passenger safety procedures", "Maintain a clean and orderly vehicle environment for every trip", "Report 100% of incidents or passenger issues promptly"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV017",
    employeeId: "260324",
    employeeName: "Egba Stella Adutomivie",
    department: "HR 1 (HR Executive 1)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_7", text: "Employee Grievance Resolution", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Resolve 90% of employee grievances within 5 working days within the next 6 months", "Achieve a conflict resolution rate of 90% or better, with no unresolved conflicts lasting more than 30 days within the next 12 months", "Performance Management"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_8", text: "Performance Review Compliance", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Ensuring 100% compliance regarding the quarterly performance review", "Execution of the result of the bi-annual performance appraisal on or before the 2nd week of the next half-year", "Recruitment and Retention"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_9", text: "Staff Turnover Reduction", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Reduce the overall employee turnover rate to 10% or less within the next 12 months", "Time-to-Hire: Reduce average time (2months) taken to fill open positions within the next 12months", "Onboarding: Within one week of resumption"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_10", text: "Confirmation Letter Distribution", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Ensure employees receive confirmation letters by the first week of the 7th month", "Payroll Management and Statutory Compliance", "Achieve a payroll accuracy rate of 99.5% or better, with no more than 0.5% errors in payroll processing within the next 6 months"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_11", text: "Statutory Payments & Payroll Processing", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Ensure a monthly schedule of all (Pension, Tax, NSITF, etc.) statutory payments on or before the last day of every month", "Ensure submission of payroll approval for salaries on the 22nd of the month", "Ensure payment of monthly salaries on the 26th of the month for all staff and on the 24th for NBC"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_12", text: "Employee Engagement & Satisfaction", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Employee Engagement and Satisfaction", "Bi-annual Execution of Employee Satisfaction Survey \u2013 Timeline 3weeks", "Ensure 75% participation rate in the surveys"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_13", text: "Employee Engagement & Satisfaction", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Achieve a 75% engagement score by the end of the year", "Exit Management", "Average Time-to-Exit: Average time taken to complete the exit process"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_14", text: "Exit Process Completion Rate", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Exit Process Completion Rate: Percentage of exit processes completed within a specified timeframe"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV018",
    employeeId: "260325",
    employeeName: "Isaac Ekpo James",
    department: "Marketing 2 (Marketing Executive & CSR)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_MARKETING_7", text: "Customer Satisfaction & Inquiry Management", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 2 (Marketing Executive & CSR)"], description: ["Maintain customer satisfaction rating of 85\u201390% or higher (where feedback is collected)", "Ensure 100% accurate logging of customer enquiries and leads", "Support generation of qualified leads through marketing interactions and follow-ups"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_MARKETING_8", text: "Client Communications Quality", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 2 (Marketing Executive & CSR)"], description: ["Maintain professional and courteous communication with all customers"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV019",
    employeeId: "260327",
    employeeName: "Ekwealor Oluchi Ugochi",
    department: "NOC 2 (Fleet Monitoring Officer)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_7", text: "Vehicle Utilization & Efficiency", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Fleet Utilization Rate: Increased by 30% Percent due to proper monitoring and frequent call outs", "30% Reduction in Idle Time: Decrease in unnecessary vehicle idling time"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_8", text: "Driver Performance & Safety", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Driver Compliance Rate: Increase the number of averted risks due to call-outs", "Number of Violations: Reduce cases of speeding, harsh braking, and long parking"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_9", text: "Reporting & Monitoring Accuracy", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Report Timeliness: Percentage of reports submitted on time (daily, weekly, monthly)", "Data Accuracy Rate: Accuracy and reliability of fleet reports generated", "Incident Reporting Response Time: Average time taken to detect and escalate issues"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_10", text: "Alarm Detection & Monitoring", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Alarm Detection & Monitoring"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV020",
    employeeId: "260328",
    employeeName: "Onebunne Ginika Perpetus",
    department: "NOC 2 (Fleet Monitoring Officer)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_7", text: "Vehicle Utilization & Efficiency", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Fleet Utilization Rate: Increased by 30% Percent due to proper monitoring and frequent call outs", "30% Reduction in Idle Time: Decrease in unnecessary vehicle idling time"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_8", text: "Driver Performance & Safety", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Driver Compliance Rate: Increase the number of averted risks due to call-outs", "Number of Violations: Reduce cases of speeding, harsh braking, and long parking"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_9", text: "Reporting & Monitoring Accuracy", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Report Timeliness: Percentage of reports submitted on time (daily, weekly, monthly)", "Data Accuracy Rate: Accuracy and reliability of fleet reports generated", "Incident Reporting Response Time: Average time taken to detect and escalate issues"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_10", text: "Alarm Detection & Monitoring", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Alarm Detection & Monitoring"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV021",
    employeeId: "260329",
    employeeName: "Ogundipe Femi Felix",
    department: "Finance 4 (Finance Analyst)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_18", text: "Fuel Efficiency & Usage Tracking", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 4 (Finance Analyst)"], description: ["Achieve 5\u201310% annual reduction in fuel wastage or inefficiencies through monitoring and analysis", "Maintain 100% accurate tracking of fuel purchases and usage records", "Fuel Data Accuracy & Reporting"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_19", text: "Fuel Reconciliations & Consumption Analysis", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 4 (Finance Analyst)"], description: ["Ensure 100% reconciliation of fuel logs with fuel purchase records and vehicle usage reports", "Submit monthly fuel consumption reports and cost analysis within the first 5 working days of each month", "Financial Reporting Timeliness"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_20", text: "Financial Reporting & Analysis Accuracy", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 4 (Finance Analyst)"], description: ["Deliver 100% of scheduled financial reports and management dashboards on time", "Maintain a financial reporting accuracy rate of at least 98\u2013100%", "Operational Cost Monitoring"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_21", text: "Operational Cost Optimization", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 4 (Finance Analyst)"], description: ["Identify and report at least 3\u20135 cost-saving opportunities annually related to fuel usage, fleet operations, or maintenance", "Compliance Monitoring", "Conduct quarterly audits of fuel logs and maintenance documentation for all operational vehicles"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_22", text: "Fuel Compliance Auditing", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 4 (Finance Analyst)"], description: ["Maintain 100% documentation compliance for fuel and vehicle maintenance records", "Fleet Efficiency Monitoring", "Maintain complete fuel consumption records for 100% of operational vehicles"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_23", text: "Fuel Anomaly & Irregularity Detection", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 4 (Finance Analyst)"], description: ["Detect and report 100% of fuel anomalies or irregular usage patterns within 48 hours of discovery"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV022",
    employeeId: "260330",
    employeeName: "Anucha Oluebube Precious",
    department: "Admin/HR 3 (Office Assistant)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_5", text: "Convenience Area Cleanliness", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Admin/HR 3 (Office Assistant)"], description: ["Ensure all convenience areas (restrooms) are cleaned at least 3 times per day", "Timeliness and reliability in completing errands and tasks", "Proper handling of office items and supplies"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_6", text: "Office Operations Support", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Admin/HR 3 (Office Assistant)"], description: ["General support effectiveness in office operations"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV023",
    employeeId: "260331",
    employeeName: "Ibemere Onyekachi Precious",
    department: "NOC 2 (Fleet Monitoring Officer)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_7", text: "Vehicle Utilization & Efficiency", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Fleet Utilization Rate: Increased by 30% Percent due to proper monitoring and frequent call outs", "30% Reduction in Idle Time: Decrease in unnecessary vehicle idling time"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_8", text: "Driver Performance & Safety", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Driver Compliance Rate: Increase the number of averted risks due to call-outs", "Number of Violations: Reduce cases of speeding, harsh braking, and long parking"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_9", text: "Reporting & Monitoring Accuracy", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Report Timeliness: Percentage of reports submitted on time (daily, weekly, monthly)", "Data Accuracy Rate: Accuracy and reliability of fleet reports generated", "Incident Reporting Response Time: Average time taken to detect and escalate issues"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_10", text: "Alarm Detection & Monitoring", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Alarm Detection & Monitoring"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV024",
    employeeId: "260332",
    employeeName: "Nwaoha Michael Onyekwere",
    department: "Fleet 7 (HSE Executive)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_24", text: "Incident Report Submission Speed", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 7 (HSE Executive)"], description: ["Incidence report submission not more than 12 hours after the occurrence", "Monthly incidence rate and near miss not more than 2", "100% availability of First Aid box items at all times"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_25", text: "HSE Incident Action Closure", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 7 (HSE Executive)"], description: ["Corrective action closure plans submission within 24 hours of incidence", "80% all time customer satisfaction majorly from driver performance metrics", "Zero tolerance for security breaches or theft incidents"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV025",
    employeeId: "260333",
    employeeName: "Ishaq Ibrahim",
    department: "Fleet 1 (Bus Assistant)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_1", text: "High Passenger Satisfaction Levels (85\u201390%)", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 1 (Bus Assistant)"], description: ["Ensure 100% compliance with passenger safety procedures", "Maintain a clean and orderly vehicle environment for every trip", "Report 100% of incidents or passenger issues promptly"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV026",
    employeeId: "260334",
    employeeName: "Umezurike Esther Chinaza",
    department: "Admin/HR 1 (Front Desk & Account Support)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_1", text: "Visitor Management & Professional Appearance", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Admin/HR 1 (Front Desk & Account Support)"], description: ["Maintain 100% accurate front desk and visitor records", "Ensure financial documentation accuracy above 98%", "Provide timely administrative support for finance operations"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_2", text: "Front Desk Office Supplies & Task Execution", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Admin/HR 1 (Front Desk & Account Support)"], description: ["Ensure 100% professional demeanour and appearance at all times", "Timeliness in restocking of office supplies"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV027",
    employeeId: "260335",
    employeeName: "Apeh Blessing Ojone",
    department: "Marketing 6 (Sales Closer)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_MARKETING_15", text: "Sales Deal Closure", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 6 (Sales Closer)"], description: ["Revenue generated across business units", "Lead-to-sale conversion rate (This will be based on the amount communicated per time)", "Client retention, repeat business, and referrals"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV028",
    employeeId: "260336",
    employeeName: "Adenigba Elizabeth Adejumoke",
    department: "Marketing 6 (Sales Closer)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_MARKETING_15", text: "Sales Deal Closure", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 6 (Sales Closer)"], description: ["Revenue generated across business units", "Lead-to-sale conversion rate (This will be based on the amount communicated per time)", "Client retention, repeat business, and referrals"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV029",
    employeeId: "260337",
    employeeName: "Edith Abosede Friday",
    department: "Marketing 6 (Sales Closer)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_MARKETING_15", text: "Sales Deal Closure", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 6 (Sales Closer)"], description: ["Revenue generated across business units", "Lead-to-sale conversion rate (This will be based on the amount communicated per time)", "Client retention, repeat business, and referrals"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV030",
    employeeId: "260338",
    employeeName: "Chijioke David Somtochukwu",
    department: "NOC 2 (Fleet Monitoring Officer)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_7", text: "Vehicle Utilization & Efficiency", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Fleet Utilization Rate: Increased by 30% Percent due to proper monitoring and frequent call outs", "30% Reduction in Idle Time: Decrease in unnecessary vehicle idling time"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_8", text: "Driver Performance & Safety", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Driver Compliance Rate: Increase the number of averted risks due to call-outs", "Number of Violations: Reduce cases of speeding, harsh braking, and long parking"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_9", text: "Reporting & Monitoring Accuracy", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Report Timeliness: Percentage of reports submitted on time (daily, weekly, monthly)", "Data Accuracy Rate: Accuracy and reliability of fleet reports generated", "Incident Reporting Response Time: Average time taken to detect and escalate issues"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_10", text: "Alarm Detection & Monitoring", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Alarm Detection & Monitoring"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV031",
    employeeId: "260339",
    employeeName: "Ifeanyi Gerald Obinna",
    department: "Marketing 6 (Sales Closer)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_MARKETING_15", text: "Sales Deal Closure", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 6 (Sales Closer)"], description: ["Revenue generated across business units", "Lead-to-sale conversion rate (This will be based on the amount communicated per time)", "Client retention, repeat business, and referrals"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV032",
    employeeId: "260340",
    employeeName: "Abosede Ajayi",
    department: "Marketing 6 (Sales Closer)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_MARKETING_15", text: "Sales Deal Closure", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Marketing 6 (Sales Closer)"], description: ["Revenue generated across business units", "Lead-to-sale conversion rate (This will be based on the amount communicated per time)", "Client retention, repeat business, and referrals"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV033",
    employeeId: "260341",
    employeeName: "Oluwatobiloba Olateju",
    department: "Finance 1 (Acc Payable)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_1", text: "Payment Timeliness & Accuracy", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 1 (Acc Payable)"], description: ["Ensure 100% of approved payments are processed within 24\u201372 hours of approval", "Maintain payment processing accuracy rate of 98\u2013100%", "Record zero unauthorized or duplicate payments"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_2", text: "Payables Management", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 1 (Acc Payable)"], description: ["Maintain 100% accurate accounts payable records", "Ensure at least 90\u201395% of vendor payments are made within agreed terms", "Keep overdue payables within acceptable thresholds"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_3", text: "Statutory Compliance", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 1 (Acc Payable)"], description: ["Ensure 100% timely remittance of statutory deductions (PAYE, VAT, pension, HMO, etc.)", "Maintain zero penalties arising from late or incorrect tax filings", "Ensure 100% accuracy in tax reporting and documentation"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_4", text: "Financial Reporting", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 1 (Acc Payable)"], description: ["Submit 100% of financial reports on schedule (weekly/monthly)", "Maintain 98\u2013100% accuracy in financial statements and payable reports"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_5", text: "Reconciliation & Audit Readiness", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 1 (Acc Payable)"], description: ["Complete monthly vendor reconciliations with zero unresolved discrepancies beyond one reporting cycle", "Maintain 100% audit-ready documentation for all payments and statutory remittances"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_6", text: "Expense Monitoring & Control", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 1 (Acc Payable)"], description: ["Identify and report at least 3\u20135 cost or process improvement opportunities annually", "Ensure 100% proper classification of transactions (approved, pending, paid)", "Perform other duties as assigned by management"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV034",
    employeeId: "260342",
    employeeName: "Salami Muibat",
    department: "Fleet 1 (Driver)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV035",
    employeeId: "260343",
    employeeName: "Idowu Aina Victoria",
    department: "NOC 2 (Fleet Monitoring Officer)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_7", text: "Vehicle Utilization & Efficiency", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Fleet Utilization Rate: Increased by 30% Percent due to proper monitoring and frequent call outs", "30% Reduction in Idle Time: Decrease in unnecessary vehicle idling time"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_8", text: "Driver Performance & Safety", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Driver Compliance Rate: Increase the number of averted risks due to call-outs", "Number of Violations: Reduce cases of speeding, harsh braking, and long parking"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_9", text: "Reporting & Monitoring Accuracy", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Report Timeliness: Percentage of reports submitted on time (daily, weekly, monthly)", "Data Accuracy Rate: Accuracy and reliability of fleet reports generated", "Incident Reporting Response Time: Average time taken to detect and escalate issues"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_NOC_10", text: "Alarm Detection & Monitoring", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["NOC 2 (Fleet Monitoring Officer)"], description: ["Alarm Detection & Monitoring"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV036",
    employeeId: "260344",
    employeeName: "Akorede Sandra Bisola",
    department: "Legal 2 (Legal Counsel)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_LEGAL_3", text: "Contract Review Efficiency", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Legal 2 (Legal Counsel)"], description: ["Reduce the average contract review time to 3 business days or less within the next 12 months", "Cycle time for drafting agreements", "Maintain a draft accuracy rate of 95% or better, with no material errors, within the next 12 months"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_LEGAL_4", text: "Legal Document Drafting Speed", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Legal 2 (Legal Counsel)"], description: ["Reviewing contracts and drafting legal documents within 24 hours of receiving the request", "Risk Management and Compliance", "Reduce potential legal exposure by 10 \u2013 15% annually through proactive measures"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_LEGAL_5", text: "Regulatory Compliance & Deadlines", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Legal 2 (Legal Counsel)"], description: ["Maintain a regulatory compliance rate of 100%, with no material fines or penalties within the next 12 months", "Policy and Procedure Updates", "Quarterly review of policy document to ensure 100% adherence to relevant laws and regulations"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_LEGAL_6", text: "Legislative Policy Drafting Speed", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Legal 2 (Legal Counsel)"], description: ["Draft new company policy documents that are in line with new legislative laws within 5 working days", "Reporting and Document Management", "Submit an accurate weekly/ activity report before the close of business on Fridays"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_LEGAL_7", text: "Quarterly Compliance Audit & Reporting", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Legal 2 (Legal Counsel)"], description: ["Submit an accurate quarterly report before the quarterly review", "Conduct quarterly audit and maintenance of legal documents with a 90% accuracy", "Maintain accurate and up-to-date documents and records, with 100% compliance with document management policies within the next 6 months"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_LEGAL_8", text: "Legal Counsel", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Legal 2 (Legal Counsel)"], description: ["Legal Counsel", "Represent the company periodically in legal proceedings/meetings"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV037",
    employeeId: "260345",
    employeeName: "Goldy Godfrey",
    department: "HR 1 (HR Executive 1)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_7", text: "Employee Grievance Resolution", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Resolve 90% of employee grievances within 5 working days within the next 6 months", "Achieve a conflict resolution rate of 90% or better, with no unresolved conflicts lasting more than 30 days within the next 12 months", "Performance Management"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_8", text: "Performance Review Compliance", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Ensuring 100% compliance regarding the quarterly performance review", "Execution of the result of the bi-annual performance appraisal on or before the 2nd week of the next half-year", "Recruitment and Retention"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_9", text: "Staff Turnover Reduction", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Reduce the overall employee turnover rate to 10% or less within the next 12 months", "Time-to-Hire: Reduce average time (2months) taken to fill open positions within the next 12months", "Onboarding: Within one week of resumption"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_10", text: "Confirmation Letter Distribution", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Ensure employees receive confirmation letters by the first week of the 7th month", "Payroll Management and Statutory Compliance", "Achieve a payroll accuracy rate of 99.5% or better, with no more than 0.5% errors in payroll processing within the next 6 months"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_11", text: "Statutory Payments & Payroll Processing", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Ensure a monthly schedule of all (Pension, Tax, NSITF, etc.) statutory payments on or before the last day of every month", "Ensure submission of payroll approval for salaries on the 22nd of the month", "Ensure payment of monthly salaries on the 26th of the month for all staff and on the 24th for NBC"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_12", text: "Employee Engagement & Satisfaction", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Employee Engagement and Satisfaction", "Bi-annual Execution of Employee Satisfaction Survey \u2013 Timeline 3weeks", "Ensure 75% participation rate in the surveys"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_13", text: "Employee Engagement & Satisfaction", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Achieve a 75% engagement score by the end of the year", "Exit Management", "Average Time-to-Exit: Average time taken to complete the exit process"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_14", text: "Exit Process Completion Rate", weight: 5, type: "objective", expectedLevel: undefined, category: undefined, departments: ["HR 1 (HR Executive 1)"], description: ["Exit Process Completion Rate: Percentage of exit processes completed within a specified timeframe"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV038",
    employeeId: "260348",
    employeeName: "David Mbacha",
    department: "Finance 1 (Acc Payable)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_1", text: "Payment Timeliness & Accuracy", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 1 (Acc Payable)"], description: ["Ensure 100% of approved payments are processed within 24\u201372 hours of approval", "Maintain payment processing accuracy rate of 98\u2013100%", "Record zero unauthorized or duplicate payments"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_2", text: "Payables Management", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 1 (Acc Payable)"], description: ["Maintain 100% accurate accounts payable records", "Ensure at least 90\u201395% of vendor payments are made within agreed terms", "Keep overdue payables within acceptable thresholds"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_3", text: "Statutory Compliance", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 1 (Acc Payable)"], description: ["Ensure 100% timely remittance of statutory deductions (PAYE, VAT, pension, HMO, etc.)", "Maintain zero penalties arising from late or incorrect tax filings", "Ensure 100% accuracy in tax reporting and documentation"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_4", text: "Financial Reporting", weight: 7, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 1 (Acc Payable)"], description: ["Submit 100% of financial reports on schedule (weekly/monthly)", "Maintain 98\u2013100% accuracy in financial statements and payable reports"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_5", text: "Reconciliation & Audit Readiness", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 1 (Acc Payable)"], description: ["Complete monthly vendor reconciliations with zero unresolved discrepancies beyond one reporting cycle", "Maintain 100% audit-ready documentation for all payments and statutory remittances"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FINANCE_ACCOUNTS_6", text: "Expense Monitoring & Control", weight: 6, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Finance 1 (Acc Payable)"], description: ["Identify and report at least 3\u20135 cost or process improvement opportunities annually", "Ensure 100% proper classification of transactions (approved, pending, paid)", "Perform other duties as assigned by management"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV039",
    employeeId: "260349",
    employeeName: "Emmah James Ekanem",
    department: "Workshop 1 (Mechanic)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_WORKSHOP_1", text: "Repair Quality & Accuracy", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Workshop 1 (Mechanic)"], description: ["Ensure vehicle servicing tasks are completed within scheduled timelines", "Contribute to maintaining fleet availability above 90%", "Maintain 100% compliance with workshop safety procedures"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV040",
    employeeId: "260350",
    employeeName: "Onyinyechi Nwoye",
    department: "Admin/HR 3 (Office Assistant)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_5", text: "Convenience Area Cleanliness", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Admin/HR 3 (Office Assistant)"], description: ["Ensure all convenience areas (restrooms) are cleaned at least 3 times per day", "Timeliness and reliability in completing errands and tasks", "Proper handling of office items and supplies"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_HUMAN_RESOURCES_6", text: "Office Operations Support", weight: 20, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Admin/HR 3 (Office Assistant)"], description: ["General support effectiveness in office operations"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV041",
    employeeId: "260351",
    employeeName: "Abideen Ajisegiri",
    department: "Workshop 1 (Mechanic)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_WORKSHOP_1", text: "Repair Quality & Accuracy", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Workshop 1 (Mechanic)"], description: ["Ensure vehicle servicing tasks are completed within scheduled timelines", "Contribute to maintaining fleet availability above 90%", "Maintain 100% compliance with workshop safety procedures"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV042",
    employeeId: "260352",
    employeeName: "Odo Abuchi Emeka",
    department: "Workshop 1 (Mechanic)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_WORKSHOP_1", text: "Repair Quality & Accuracy", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Workshop 1 (Mechanic)"], description: ["Ensure vehicle servicing tasks are completed within scheduled timelines", "Contribute to maintaining fleet availability above 90%", "Maintain 100% compliance with workshop safety procedures"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV043",
    employeeId: "260353",
    employeeName: "Nwodo Julius Chukwujekwu",
    department: "Fleet 1 (Bus Assistant)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_FLEET_1", text: "High Passenger Satisfaction Levels (85\u201390%)", weight: 40, type: "objective", expectedLevel: undefined, category: undefined, departments: ["Fleet 1 (Bus Assistant)"], description: ["Ensure 100% compliance with passenger safety procedures", "Maintain a clean and orderly vehicle environment for every trip", "Report 100% of incidents or passenger issues promptly"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV044",
    employeeId: "260354",
    employeeName: "Musa Binta",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV045",
    employeeId: "260356",
    employeeName: "Banwo Ibisola Yetunde",
    department: "KHLC 2 (Supervisor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_4", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 2 (Supervisor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_5", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 2 (Supervisor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_6", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 2 (Supervisor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV046",
    employeeId: "260359",
    employeeName: "Bala Blessing",
    department: "KHLC 2 (Supervisor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_4", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 2 (Supervisor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_5", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 2 (Supervisor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_6", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 2 (Supervisor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV047",
    employeeId: "260360",
    employeeName: "Iniobong Christiana Okokon",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV048",
    employeeId: "260361",
    employeeName: "Ohaneze Irene Onyinyechi",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV049",
    employeeId: "260362",
    employeeName: "Bridget Ogochukwu Azuibuike",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV050",
    employeeId: "260363",
    employeeName: "Chioma Benita Nwanolu",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV051",
    employeeId: "260364",
    employeeName: "Alex Rita Nwakaego",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV052",
    employeeId: "260365",
    employeeName: "Adedokun Khaleed Oluwatobiloba",
    department: "KHLC 2 (Supervisor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_4", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 2 (Supervisor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_5", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 2 (Supervisor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_6", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 2 (Supervisor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV053",
    employeeId: "260366",
    employeeName: "Nwantu Faith Titus",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV054",
    employeeId: "260367",
    employeeName: "Favour Ezekiel Oladapo",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV055",
    employeeId: "260368",
    employeeName: "Faniyi Olawale Tosin",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV056",
    employeeId: "260369",
    employeeName: "Adewuyi Stephen O",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV057",
    employeeId: "260370",
    employeeName: "Tosin Oluwole Abioye",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV058",
    employeeId: "260371",
    employeeName: "Okunuga Seyi Samuel",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV059",
    employeeId: "260372",
    employeeName: "Adeyemi Halimat Adedoyin",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV060",
    employeeId: "260373",
    employeeName: "Williams Ajibola Olufunke",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV061",
    employeeId: "260374",
    employeeName: "Rita Ochuwa Oghairo",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV062",
    employeeId: "260375",
    employeeName: "Solomon Idowu Michael",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV063",
    employeeId: "260376",
    employeeName: "Salaudeen Azeezat Arike",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV064",
    employeeId: "260377",
    employeeName: "Deborah Dennis",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV065",
    employeeId: "260378",
    employeeName: "Mary Awolola",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV066",
    employeeId: "260379",
    employeeName: "Adebanjo Matthew",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV067",
    employeeId: "260380",
    employeeName: "Godday James Ejegale",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV068",
    employeeId: "260381",
    employeeName: "Jerome Joy Karlisha",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV069",
    employeeId: "260382",
    employeeName: "Akaniyene Udo Akpan",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV070",
    employeeId: "260383",
    employeeName: "Olayiwola Omotayo",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV071",
    employeeId: "260384",
    employeeName: "Joshua Obumneme Nwankwo",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: "REV072",
    employeeId: "260385",
    employeeName: "Precious Mamar",
    department: "KHLC 1 (Instructor)",
    cycleId: "CYC001",
    cycleName: "2026 Mid-Year Performance Cycle",
    status: "Draft",
    objectives: [
      { id: "OBJ_COMP_1", text: "Leadership and Accountability", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Demonstrate responsibility and ownership of task outcomes", "Lead by example and guide colleagues", "Maintain accountability for deliverables"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_2", text: "Initiative and Perseverance", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Take proactive steps to resolve issues without waiting for instructions", "Persist in overcoming obstacles and difficulties", "Seek continuous improvements in workflows"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_3", text: "Communication and Interpersonal Ability", weight: 10, type: "competency", expectedLevel: 4, category: "Behavioural", departments: undefined, description: ["Communicate clearly and effectively with team members and stakeholders", "Listen actively and cooperate well with others", "Build constructive work relationships"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_4", text: "Work Ethics and Attendance", weight: 10, type: "competency", expectedLevel: 4, category: "Culture", departments: undefined, description: ["Show high reliability and commitment to work tasks", "Maintain consistent punctuality and attendance", "Adhere strictly to corporate codes of conduct"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_5", text: "KPI Deployment for Team Members", weight: 10, type: "competency", expectedLevel: 4, category: "Leadership", departments: undefined, description: ["Clearly define and assign KPIs to direct reports", "Regularly monitor and evaluate team member performance", "Provide feedback and coaching to help team members achieve targets"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_COMP_6", text: "Self Improvement", weight: 10, type: "competency", expectedLevel: 4, category: "Self-Development", departments: undefined, description: ["Set personal development goals aligned with organizational objectives", "Actively seek feedback and opportunities to learn", "Complete training courses or obtain professional certifications"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_1", text: "Class Delivery & Lesson Execution", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure timely execution of all learning programmes by delivering >=95% of classes"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_2", text: "Resource Adherence & Lesson Plans", weight: 15, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Ensure instructors use lesson plans 100% of the time during teaching sessions"], selfScore: undefined, managerScore: undefined, comments: undefined },
      { id: "OBJ_KHLC_SKILLUP_3", text: "Instructor Skill-up & Professional Courses", weight: 10, type: "objective", expectedLevel: undefined, category: undefined, departments: ["KHLC 1 (Instructor)"], description: ["Complete at least 2 professional courses annually to improve skills and coordination"], selfScore: undefined, managerScore: undefined, comments: undefined }
    ],
    employeeComments: undefined,
    managerComments: undefined,
    hrComments: undefined,
    finalScore: undefined,
    updatedAt: new Date().toISOString()
  }
];

export function getStoredData<T>(key: string, initial: T): T {
  return initial;
}

export function setStoredData<T>(key: string, data: T): void {
  // Disabled: all fetches must load directly from database
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function fetchFromApi<T>(endpoint: string, fallbackData: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.warn(`Failed to fetch from API endpoint ${endpoint}, falling back to local storage.`, e);
  }
  return fallbackData;
}

async function ensureReviewsForActiveCycles(
  usersList: User[],
  cyclesList: ReviewCycle[],
  reviewsList: PerformanceReview[],
  objectivesList: Objective[],
  onReviewsCreated: (updated: PerformanceReview[]) => void
) {
  const activeCycle = cyclesList.find(c => c.status === "Active");
  if (!activeCycle || usersList.length === 0 || objectivesList.length === 0) return;

  let updatedReviews = [...reviewsList];
  let hasNew = false;

  for (const user of usersList) {
    const hasReview = updatedReviews.some(r => r.employeeId === user.id && r.cycleId === activeCycle.id);
    if (!hasReview) {
      const relevantObjectives = objectivesList.filter(o => {
        if (o.type === "competency") return true;
        return (o.type === "objective" || !o.type) && o.departments?.includes(user.department);
      });

      const newReviewId = `REV${activeCycle.id.replace("CYC", "")}${user.id}`;
      const newReview: PerformanceReview = {
        id: newReviewId,
        employeeId: user.id,
        employeeName: user.name,
        department: user.department,
        cycleId: activeCycle.id,
        cycleName: activeCycle.name,
        status: "Draft",
        objectives: relevantObjectives.map(o => ({
          ...o,
          selfScore: undefined,
          managerScore: undefined,
          comments: undefined,
          evidence: undefined,
          managerFeedback: undefined
        })),
        updatedAt: new Date().toISOString()
      };

      updatedReviews.push(newReview);
      hasNew = true;

      try {
        await fetch(`${API_BASE_URL}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReview)
        });
      } catch (e) {
        console.warn("Failed to sync auto-created review", e);
      }
    }
  }

  if (hasNew) {
    onReviewsCreated(updatedReviews);
  }
}

export function useERPStore() {
  const [users, setUsers] = useState<User[]>([]);
  const [cycles, setCycles] = useState<ReviewCycle[]>([]);
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const usersData = await fetchFromApi("/users", INITIAL_USERS);
      setUsers(usersData);

      const cyclesData = await fetchFromApi("/cycles", INITIAL_CYCLES);
      setCycles(cyclesData);

      const reviewsData = await fetchFromApi("/reviews", INITIAL_REVIEWS);
      setReviews(reviewsData);

      const objectivesData = await fetchFromApi("/objectives", DEFAULT_OBJECTIVES);
      setObjectives(objectivesData);

      // Auto-initialize reviews for the active cycle
      await ensureReviewsForActiveCycles(usersData, cyclesData, reviewsData, objectivesData, (updated) => {
        setReviews(updated);
        setStoredData("erp_reviews", updated);
      });
    };

    loadData();
  }, []);

  const updateReview = async (updated: PerformanceReview) => {
    const exists = reviews.some(r => r.id === updated.id);
    const list = exists 
      ? reviews.map(r => r.id === updated.id ? updated : r)
      : [...reviews, updated];
    setReviews(list);
    setStoredData("erp_reviews", list);
    try {
      await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.warn("Failed to sync updateReview with backend database", e);
    }
  };

  const addReviewCycle = async (cycle: ReviewCycle) => {
    const list = [...cycles, cycle];
    setCycles(list);
    setStoredData("erp_cycles", list);
    try {
      await fetch(`${API_BASE_URL}/cycles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cycle)
      });
      // Ensure reviews are created if the new cycle is active
      if (cycle.status === "Active") {
        await ensureReviewsForActiveCycles(users, list, reviews, objectives, (updated) => {
          setReviews(updated);
          setStoredData("erp_reviews", updated);
        });
      }
    } catch (e) {
      console.warn("Failed to sync addReviewCycle with backend database", e);
    }
  };

  const updateCycles = async (updatedList: ReviewCycle[]) => {
    setCycles(updatedList);
    setStoredData("erp_cycles", updatedList);
    try {
      for (const cycle of updatedList) {
        await fetch(`${API_BASE_URL}/cycles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cycle)
        });
      }
      // Ensure reviews are created for the newly activated cycle
      await ensureReviewsForActiveCycles(users, updatedList, reviews, objectives, (updated) => {
        setReviews(updated);
        setStoredData("erp_reviews", updated);
      });
    } catch (e) {
      console.warn("Failed to sync updateCycles with backend database", e);
    }
  };

  const updateObjectives = async (updatedList: Objective[]) => {
    const previous = [...objectives];
    setObjectives(updatedList);
    setStoredData("erp_objectives", updatedList);
    try {
      // Find deleted objectives
      const deleted = previous.filter(p => !updatedList.some(u => u.id === p.id));
      for (const d of deleted) {
        await fetch(`${API_BASE_URL}/objectives?id=${d.id}`, { method: "DELETE" });
      }
      // Find added or updated objectives
      const addedOrUpdated = updatedList.filter(u => {
        const p = previous.find(prev => prev.id === u.id);
        return !p || JSON.stringify(p) !== JSON.stringify(u);
      });
      for (const a of addedOrUpdated) {
        await fetch(`${API_BASE_URL}/objectives`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(a)
        });
      }
    } catch (e) {
      console.warn("Failed to sync updateObjectives with backend database", e);
    }
  };

  const updateUsers = async (updatedList: User[]) => {
    setUsers(updatedList);
    setStoredData("erp_users", updatedList);
    try {
      for (const user of updatedList) {
        await fetch(`${API_BASE_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user)
        });
      }
      // Ensure reviews are created for newly created users
      await ensureReviewsForActiveCycles(updatedList, cycles, reviews, objectives, (updated) => {
        setReviews(updated);
        setStoredData("erp_reviews", updated);
      });
    } catch (e) {
      console.warn("Failed to sync updateUsers with backend database", e);
    }
  };

  return {
    users,
    cycles,
    reviews,
    objectives,
    updateReview,
    addReviewCycle,
    updateCycles,
    updateObjectives,
    updateUsers
  };
}
