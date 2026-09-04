"use client";
import React, { useState, useEffect } from "react";
import { Activity, Clock, Globe2, Radio, Lock, Sparkles, Building2, ChevronDown, PhoneCall, Menu, X } from "lucide-react";
import { CITIES, CityGeography } from "@/config/cityConfig";
import { SystemMode } from "@/types";
import { UserProfile, UserRole } from "@/types/auth";
import { UserProfileMenu } from "@/components/auth/UserProfileMenu";

interface Props {
  selectedCity: CityGeography;
  onSelectCity: (city: CityGeography) => void;
  mode: SystemMode;
  onToggleMode: (mode: SystemMode) => void;
  currentUser: UserProfile | null;
  onOpenAuth: (mode: "login" | "register") => void;
  onLogout: () => void;
  onSwitchRole?: (role: UserRole) => void;
  onOpenHelplines?: () => void;
}

export function Header({
  selectedCity,
  onSelectCity,
  mode,
  onToggleMode,
  currentUser,
  onOpenAuth,
  onLogout,
  onSwitchRole,
  onOpenHelplines
}: Props) {
  const [timeStr, setTimeStr] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-IN", { timeZone: selectedCity.timezone, hour12: false }) + " IST");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  // Handle active state smoothly
  const [activeHash, setActiveHash] = useState<string>("");
  useEffect(() => {
    setActiveHash(window.location.hash);
    const handleHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navLinkClass = (hash: string) => 
    `transition-colors whitespace-nowrap ${
      activeHash === hash || (activeHash === "" && hash === "#city-snapshot")
        ? "text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg" 
        : "hover:text-emerald-700 px-3 py-1.5"
    }`;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-[76px] flex items-center justify-between gap-6">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-emerald-600 flex items-center justify-center shadow-sm text-white font-black text-lg tracking-tighter">
            CF
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">CITYFLOW</span>
              <span className="hidden sm:flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 leading-none items-center">
                ENTERPRISE
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-500 font-medium mt-1.5 leading-none">
              Urban Mobility & Logistics OS
            </p>
          </div>
        </div>

        {/* Center Navigation - Hidden if logged in as modules take over */}
        {!currentUser && (
          <nav className="hidden lg:flex items-center gap-2 text-[14px] font-semibold text-slate-600 shrink-0">
            <a href="#city-snapshot" className={navLinkClass("#city-snapshot")}>Digital Twin</a>
            <a href="#features" className={navLinkClass("#features")}>Platform</a>
            <a href="#solutions" className={navLinkClass("#solutions")}>Solutions</a>
            <a href="#how-it-works" className={navLinkClass("#how-it-works")}>How It Works</a>
            
            <a href="#logistics" className={`hidden xl:block ${navLinkClass("#logistics")}`}>Logistics</a>
            <a href="#impact" className={`hidden xl:block ${navLinkClass("#impact")}`}>Impact</a>
            <a href="#faq" className={`hidden xl:block ${navLinkClass("#faq")}`}>FAQ</a>
            
            <div className="relative group hidden lg:block xl:hidden">
              <button className="flex items-center gap-1 hover:text-emerald-700 transition px-3 py-1.5 whitespace-nowrap">
                More <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-100 p-2 hidden group-hover:block">
                <a href="#logistics" className="block px-3 py-2 text-[14px] hover:bg-slate-50 rounded-lg whitespace-nowrap">Logistics</a>
                <a href="#impact" className="block px-3 py-2 text-[14px] hover:bg-slate-50 rounded-lg whitespace-nowrap">Impact</a>
                <a href="#faq" className="block px-3 py-2 text-[14px] hover:bg-slate-50 rounded-lg whitespace-nowrap">FAQ</a>
              </div>
            </div>
          </nav>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0 ml-auto lg:ml-0">
          
          {/* Location */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-100/80 transition-colors w-[150px]">
            <Globe2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <select
              value={selectedCity.id}
              onChange={(e) => onSelectCity(CITIES[e.target.value] || selectedCity)}
              className="bg-transparent text-[13px] font-semibold text-slate-800 focus:outline-none cursor-pointer w-full truncate"
            >
              {Object.values(CITIES).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Clock */}
          <div className="hidden lg:flex items-center justify-center gap-1.5 text-[13px] font-mono font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg w-[110px] whitespace-nowrap shrink-0">
            <span className="text-slate-400">◷</span>
            <span>{timeStr ? timeStr.replace(" IST", "") : "--:--"} <span className="text-[10px] text-slate-400 font-sans font-bold">IST</span></span>
          </div>

          {/* Live / Sim */}
          <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[12px] w-[110px] shrink-0">
            <button
              onClick={() => onToggleMode("LIVE")}
              className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-md font-semibold transition-all ${
                mode === "LIVE" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${mode === "LIVE" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}></span>
              LIVE
            </button>
            <button
              onClick={() => onToggleMode("SIMULATION")}
              className={`flex-1 flex items-center justify-center py-1 rounded-md font-semibold transition-all ${
                mode === "SIMULATION" ? "bg-amber-400 text-slate-950 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              SIM
            </button>
          </div>

          {/* Help */}
          {onOpenHelplines && (
            <button
              onClick={onOpenHelplines}
              className="hidden sm:flex items-center justify-center text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-md text-[14px] font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              ☎ Help
            </button>
          )}

          {/* Sign In / User */}
          {currentUser ? (
            <UserProfileMenu
              user={currentUser}
              onLogout={onLogout}
              onSwitchRole={onSwitchRole}
            />
          ) : (
            <button
              onClick={() => onOpenAuth("login")}
              className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[14px] font-semibold transition shadow-sm w-[110px] h-[44px] flex items-center justify-center shrink-0"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          {!currentUser && (
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg shrink-0"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {!currentUser && mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-4 shadow-lg absolute w-full left-0">
          <nav className="flex flex-col gap-2 text-[15px] font-semibold text-slate-700">
            <a href="#city-snapshot" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 hover:bg-slate-50 rounded-lg">Digital Twin</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 hover:bg-slate-50 rounded-lg">Platform</a>
            <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 hover:bg-slate-50 rounded-lg">Solutions</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 hover:bg-slate-50 rounded-lg">How It Works</a>
            <a href="#logistics" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 hover:bg-slate-50 rounded-lg">Logistics</a>
            <a href="#impact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 hover:bg-slate-50 rounded-lg">Impact</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 hover:bg-slate-50 rounded-lg">FAQ</a>
          </nav>
          
          <div className="h-px bg-slate-200 my-2"></div>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <Globe2 className="w-4 h-4 text-emerald-700" />
              <select
                value={selectedCity.id}
                onChange={(e) => {
                  onSelectCity(CITIES[e.target.value] || selectedCity);
                  setMobileMenuOpen(false);
                }}
                className="bg-transparent text-[14px] font-semibold text-slate-800 focus:outline-none w-full"
              >
                {Object.values(CITIES).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-[13px]">
              <button
                onClick={() => { onToggleMode("LIVE"); setMobileMenuOpen(false); }}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md font-semibold transition-all ${
                  mode === "LIVE" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-500"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${mode === "LIVE" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}></span>
                LIVE
              </button>
              <button
                onClick={() => { onToggleMode("SIMULATION"); setMobileMenuOpen(false); }}
                className={`flex-1 flex items-center justify-center py-1.5 rounded-md font-semibold transition-all ${
                  mode === "SIMULATION" ? "bg-amber-400 text-slate-950 shadow-sm" : "text-slate-500"
                }`}
              >
                SIMULATION
              </button>
            </div>

            {onOpenHelplines && (
              <button
                onClick={() => { onOpenHelplines(); setMobileMenuOpen(false); }}
                className="flex items-center justify-center text-rose-600 bg-rose-50 px-3 py-2 rounded-lg text-[14px] font-semibold"
              >
                ☎ Emergency Helplines
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}