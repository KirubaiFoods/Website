"use client";

import { useState, useEffect } from "react";

export default function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let activeRequests = 0;
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      let isApiCall = false;
      const url =
        typeof args[0] === "string"
          ? args[0]
          : args[0] instanceof Request
          ? args[0].url
          : "";

      // We only want to show the loader for our own /api/ calls
      if (url.includes("/api/")) {
        isApiCall = true;
        activeRequests++;
        setIsLoading(true);
      }

      try {
        const response = await originalFetch(...args);
        return response;
      } finally {
        if (isApiCall) {
          activeRequests--;
          if (activeRequests === 0) {
            setIsLoading(false);
          }
        }
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-700 rounded-full animate-spin"></div>
        <p className="mt-4 text-red-700 font-bold text-xs tracking-widest uppercase animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
