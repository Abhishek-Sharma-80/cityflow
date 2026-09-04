"use client";

import React, { useEffect, useState } from "react";
import { ChevronRight, Home } from "lucide-react";

export type ColorKey = "emerald" | "blue" | "purple" | "amber" | "indigo" | "rose" | "slate";

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

export interface PageHeaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  actions?: React.ReactNode;
  accentColor?: ColorKey | string;
}

const colorStyles: Record<string, { accentBar: string; iconBg: string; iconText: string }> = {
  emerald: { accentBar: "bg-gradient-to-b from-emerald-400 to-emerald-600", iconBg: "bg-emerald-100", iconText: "text-emerald-600" },
  blue: { accentBar: "bg-gradient-to-b from-blue-400 to-blue-600", iconBg: "bg-blue-100", iconText: "text-blue-600" },
  purple: { accentBar: "bg-gradient-to-b from-purple-400 to-purple-600", iconBg: "bg-purple-100", iconText: "text-purple-600" },
  amber: { accentBar: "bg-gradient-to-b from-amber-400 to-amber-600", iconBg: "bg-amber-100", iconText: "text-amber-600" },
  indigo: { accentBar: "bg-gradient-to-b from-indigo-400 to-indigo-600", iconBg: "bg-indigo-100", iconText: "text-indigo-600" },
  rose: { accentBar: "bg-gradient-to-b from-rose-400 to-rose-600", iconBg: "bg-rose-100", iconText: "text-rose-600" },
  slate: { accentBar: "bg-gradient-to-b from-slate-400 to-slate-600", iconBg: "bg-slate-100", iconText: "text-slate-600" },
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  icon: Icon,
  title,
  description,
  breadcrumbs,
  actions,
  accentColor = "emerald",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const styles = colorStyles[accentColor as keyof typeof colorStyles] || colorStyles.emerald;

  return (
    <div
      className={`relative w-full bg-white border-b border-slate-200 px-6 py-5 transition-opacity duration-500 ease-in-out ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-md ${styles.accentBar}`} />

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap items-center space-x-1 text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
          <button
            type="button"
            className="hover:text-slate-800 transition-colors flex items-center"
            onClick={() => {
              if (breadcrumbs.length > 0 && breadcrumbs[0].label.toLowerCase() === "home" && breadcrumbs[0].onClick) {
                breadcrumbs[0].onClick();
              }
            }}
          >
            <Home className="w-4 h-4 mr-1" />
            <span className="sr-only">Home</span>
          </button>
          
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            // Skip rendering if it's the first one and called Home, since we already have the Home icon
            if (index === 0 && crumb.label.toLowerCase() === "home") return null;

            return (
              <React.Fragment key={index}>
                <ChevronRight className="w-4 h-4 text-slate-400 mx-1 flex-shrink-0" />
                {crumb.onClick && !isLast ? (
                  <button
                    type="button"
                    onClick={crumb.onClick}
                    className="hover:text-slate-800 transition-colors truncate max-w-[120px] sm:max-w-[200px]"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className={`truncate max-w-[120px] sm:max-w-[200px] ${isLast ? "text-slate-800 font-medium" : ""}`}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Main Content */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${styles.iconBg} ${styles.iconText} flex-shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {description}
              </p>
            </div>
          </div>

          {actions && (
            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
