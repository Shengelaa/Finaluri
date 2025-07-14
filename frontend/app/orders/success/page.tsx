"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/");
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="relative h-screen w-screen bg-white text-black flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_black_2px,_transparent_0.5px)] bg-[length:50px_50px] animate-pulse opacity-20 z-0"></div>

      <div className="z-10 text-center px-4 text-black">
        <h1 className="text-4xl md:text-6xl font-bold mb-4"> Thank You! </h1>
        <p className="text-xl md:text-2xl mb-2">
          Your purchase was successful.
        </p>
        <p className="text-md text-gray-900">
          Redirecting to homepage in{" "}
          <span className="font-semibold text-red-800">{countdown}</span>{" "}
          seconds...
        </p>
      </div>
    </div>
  );
}
