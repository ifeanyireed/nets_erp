import ManagerReviewClient from "./ManagerReviewClient";

export async function generateStaticParams() {
  return [
    { employeeId: "EMP001" },
    { employeeId: "EMP002" },
    { employeeId: "EMP003" },
    { employeeId: "EMP004" },
    { employeeId: "EMP005" }
  ];
}

export default function ManagerReviewPage() {
  return <ManagerReviewClient />;
}
