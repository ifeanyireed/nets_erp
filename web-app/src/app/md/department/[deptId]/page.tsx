import DepartmentPerformanceClient from "./DepartmentPerformanceClient";

export async function generateStaticParams() {
  const depts = [
    "Finance 1 (Acc Payable)",
    "Finance 2 (Acc Receivable)",
    "Finance 3 (Accountant)",
    "Finance 4 (Finance Analyst)",
    "Finance 5 (Head of Finance)",
    "HR 1 (HR Executive 1)",
    "HR 2 (HR Executive 2)",
    "HR 3 (Admin Manager)",
    "HR 4 (Office Assistant)",
    "HR 5 (HR Manager)",
    "ERP/IT 1 (ERP/IT Officer)",
    "Internal Control 1 (IC Manager)",
    "Legal 1 (Legal Counsel/EA)",
    "Legal 2 (EA to MD)",
    "Marketing 1 (Marketing Executive)",
    "Marketing 2 (Retail Marketing)",
    "Marketing 3 (Marketing Head)",
    "Marketing 4 (Business Manager)",
    "Marketing 5 (Social Media Executive)",
    "Marketing 6 (Sales Closer)",
    "NOC 1 (Fleet Monitoring Officer)",
    "Fleet 1 (Driver)",
    "Fleet 2 (Fleet Supervisor)",
    "Fleet 3 (Fleet Maintenance Officer)",
    "Fleet 4 (HSE Officer)",
    "Fleet 5 (Facility Manager)",
    "Fleet 6 (Corporate Bus Deployer)",
    "Fleet 7 (HSE Executive)",
    "Workshop 1 (Mechanic Intern)",
    "Workshop 2 (Mechanic)",
    "Workshop 3 (Workshop Manager)",
    "KHLC 1 (Instructor)",
    "KHLC 2 (Supervisor)",
    "KHLC 3 (Skill Up Coordinator)",
    "KHLC 4 (Program Coordinator)",
    "KHLC 5 (Robotics Head)",
    "KHLC 6 (Social Media/Admin)"
  ];
  return depts.map(d => ({ deptId: d }));
}

export default function DepartmentPerformancePage() {
  return <DepartmentPerformanceClient />;
}
