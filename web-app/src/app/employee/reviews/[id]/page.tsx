import ReviewDetailClient from "./ReviewDetailClient";

export async function generateStaticParams() {
  return [
    { id: "REV001" },
    { id: "REV002" },
    { id: "REV003" },
    { id: "REV004" },
    { id: "REV005" }
  ];
}

export default function ReviewDetailPage() {
  return <ReviewDetailClient />;
}
