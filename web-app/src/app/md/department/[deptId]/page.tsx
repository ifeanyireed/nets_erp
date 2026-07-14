import DepartmentPerformanceClient from "./DepartmentPerformanceClient";

export async function generateStaticParams() {
  const depts = [
    "Fleet",
    "Marketing",
    "NOC",
    "Finance & Accounts",
    "Admin/HR",
    "Human Resources",
    "Legal",
    "Workshop",
    "Internal Control",
    "KHLC/Skillup"
  ];
  return depts.map(d => ({ deptId: d }));
}

export default function DepartmentPerformancePage() {
  return <DepartmentPerformanceClient />;
}
