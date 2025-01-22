"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StripeReturn() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams(); // Access query parameters
  const sessionId = searchParams.get("session_id");
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/stripe/return?session_id=${sessionId}`);
        const data = await res.json();
        if (data.error) {
          console.error("Failed to retrieve session:", data.error);
        } else {
          setSession(data.session);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSession();
    } else {
      router.push("/"); // Redirect if session_id is missing
    }
  }, [sessionId, router]);

  if (loading) return <p>Loading session details...</p>;

  if (!session) return <p>Session not found or invalid.</p>;

  return (
    <div className="container">
      <h1>Thank You for Your Purchase!</h1>
      <p>Subscription: {session.subscription}</p>
      <p>Customer Email: {session.customer_email}</p>
      <p>
        Total Paid: {(session.amount_total / 100).toFixed(2)}{" "}
        {session.currency.toUpperCase()}
      </p>
    </div>
  );
}
