"use client";

import { useEffect, useState, useCallback } from "react";

import { getApiUrl } from "@/config/api";

type ServiceStatus = "checking" | "healthy" | "unhealthy";

interface HealthStatus {
  frontend: ServiceStatus;
  backend: ServiceStatus;
  database: ServiceStatus;
  error?: string;
}

export function StatusSection() {
  const [status, setStatus] = useState<HealthStatus>({
    frontend: "healthy",
    backend: "checking",
    database: "checking",
  });

  const checkHealth = useCallback(async () => {
    try {
      const response = await fetch(`${getApiUrl()}/health`, {
        cache: "no-store",
      });

      // If we got any response from the backend, it's reachable (healthy)
      const data = await response.json();

      setStatus({
        frontend: "healthy",
        backend: "healthy",
        database: data.database === "connected" ? "healthy" : "unhealthy",
        error: data.error,
      });
    } catch (error) {
      // Only mark backend as unhealthy if it's completely unreachable
      setStatus({
        frontend: "healthy",
        backend: "unhealthy",
        database: "unhealthy",
        error: error instanceof Error ? error.message : "Connection failed",
      });
    }
  }, []);

  useEffect(() => {
    void checkHealth();

    const interval = setInterval(() => {
      void checkHealth();
    }, 5000);

    return () => clearInterval(interval);
  }, [checkHealth]);

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case "healthy":
        return "text-green-500";
      case "unhealthy":
        return "text-red-500";
      case "checking":
        return "text-yellow-500";
    }
  };

  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case "healthy":
        return "✓";
      case "unhealthy":
        return "✗";
      case "checking":
        return "⟳";
    }
  };

  const getStatusText = (status: ServiceStatus) => {
    switch (status) {
      case "healthy":
        return "Healthy";
      case "unhealthy":
        return "Unhealthy";
      case "checking":
        return "Checking...";
    }
  };

  return (
    <div className="w-full max-w-xl mt-8">
      <h2 className="text-xl font-semibold mb-4 text-center">System Status</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-4 rounded-lg border border-default-200">
          <div className={`text-4xl ${getStatusColor(status.frontend)}`}>
            {getStatusIcon(status.frontend)}
          </div>
          <div className="mt-2 font-semibold">Frontend</div>
          <div className={`text-sm ${getStatusColor(status.frontend)}`}>
            {getStatusText(status.frontend)}
          </div>
        </div>

        <div className="flex flex-col items-center p-4 rounded-lg border border-default-200">
          <div className={`text-4xl ${getStatusColor(status.backend)}`}>
            {getStatusIcon(status.backend)}
          </div>
          <div className="mt-2 font-semibold">Backend</div>
          <div className={`text-sm ${getStatusColor(status.backend)}`}>
            {getStatusText(status.backend)}
          </div>
        </div>

        <div className="flex flex-col items-center p-4 rounded-lg border border-default-200">
          <div className={`text-4xl ${getStatusColor(status.database)}`}>
            {getStatusIcon(status.database)}
          </div>
          <div className="mt-2 font-semibold">Database</div>
          <div className={`text-sm ${getStatusColor(status.database)}`}>
            {getStatusText(status.database)}
          </div>
        </div>
      </div>

      {status.error && (
        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="text-sm text-red-500">
            <strong>Error:</strong> {status.error}
          </div>
        </div>
      )}
    </div>
  );
}
