"use client";
import AuthForm from "../components/Auth";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Auth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      if (typeof window !== "undefined") {
        if (window.innerWidth >= 1024) {
          // For desktop, redirect to home (Profile_pc component will be activated)
          router.push("/");
        } else {
          // For mobile, redirect to profile
          router.push("/profile");
        }
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <AuthForm />
    </>
  );
}
