"use client";
import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, Shield, ChevronDown, CheckCircle2, Building, Mail } from "lucide-react";
import { UserProfile, UserRole } from "@/types/auth";

interface Props {
  user: UserProfile;
  onLogout: () => void;
  onSwitchRole?: (role: UserRole) => void;
}

export function UserProfileMenu({ user, onLogout, onSwitchRole }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roleStyles: Record<UserRole, { bg: string; text: string; border: string; label: string }> = {
    AUTHORITY: {
      bg: "bg-emerald-100",
      text: "text-emerald-900",
      border: "border-emerald-300",
      label: "🏛️ Authority"
    },
    LOGISTICS_OPERATOR: {
      bg: "bg-blue-100",
      text: "text-blue-900",
      border: "border-blue-300",
      label: "🚚 Logistics Fleet"
    },
    CITIZEN: {
      bg: "bg-teal-100",
      text: "text-teal-900",
      border: "border-teal-300",
      label: "🚶 Citizen"
    }
  };

  const currentRoleStyle = roleStyles[user.role] || roleStyles.CITIZEN;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="text-left hidden lg:block">
          <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{user.name}</div>
          <div className="text-[10px] text-slate-500 font-medium">{user.role}</div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* User Details Header */}
          <div className="px-4 py-3 border-b border-slate-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">{user.name}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${currentRoleStyle.bg} ${currentRoleStyle.text} ${currentRoleStyle.border}`}>
                {currentRoleStyle.label}
              </span>
            </div>
            <div className="text-xs text-slate-500 truncate flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{user.email}</span>
            </div>
            {user.department && (
              <div className="text-[11px] text-slate-600 pt-1 font-medium">
                🏢 {user.department}
              </div>
            )}
            <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50 p-1 rounded border border-emerald-200 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Authenticated Enterprise Session</span>
            </div>
          </div>

          {/* Quick Role Switcher */}
          {onSwitchRole && (
            <div className="p-3 border-b border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Switch Perspective:
              </span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => {
                    onSwitchRole("AUTHORITY");
                    setIsOpen(false);
                  }}
                  className={`p-1.5 rounded-lg text-[10px] font-bold border transition ${
                    user.role === "AUTHORITY" ? "bg-emerald-700 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Authority
                </button>
                <button
                  onClick={() => {
                    onSwitchRole("LOGISTICS_OPERATOR");
                    setIsOpen(false);
                  }}
                  className={`p-1.5 rounded-lg text-[10px] font-bold border transition ${
                    user.role === "LOGISTICS_OPERATOR" ? "bg-blue-700 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Logistics
                </button>
                <button
                  onClick={() => {
                    onSwitchRole("CITIZEN");
                    setIsOpen(false);
                  }}
                  className={`p-1.5 rounded-lg text-[10px] font-bold border transition ${
                    user.role === "CITIZEN" ? "bg-teal-700 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Citizen
                </button>
              </div>
            </div>
          )}

          {/* Logout Action */}
          <div className="p-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full px-3 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}