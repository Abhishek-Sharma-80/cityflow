"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  Sparkles,
  Bot,
  RotateCcw,
  Loader2
} from "lucide-react";
import { CityGeography } from "@/config/cityConfig";
import { WeatherData, AirQualityData, LogisticsPressureBreakdown, IncidentReport } from "@/types";

interface Props {
  selectedCity: CityGeography;
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  pressure: LogisticsPressureBreakdown | null;
  incidents: IncidentReport[];
  onOpenHelplines?: () => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function AIChatbotWidget({
  selectedCity,
  weather,
  airQuality,
  pressure,
  incidents,
  onOpenHelplines
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: "Hi! I'm Jim, your virtual assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).toLowerCase()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async () => {
    const query = input.trim();
    if (!query || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).toLowerCase()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const historyForApi = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyForApi,
          cityId: selectedCity.id,
          liveTelemetry: {
            city: selectedCity,
            weather,
            airQuality,
            pressure,
            incidents,
            fleetCount: 6,
            delayedVehicles: 1
          }
        })
      });

      if (!res.ok) {
        throw new Error("Failed to reach Jim AI Assistant");
      }

      const data = await res.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response || "I have received your query.",
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).toLowerCase()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `⚠️ ${err.message || "Connection timeout"}. Please try again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).toLowerCase()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: "Hi! I'm Jim, your virtual assistant. How can I help you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).toLowerCase()
      }
    ]);
    setShowMenu(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* 1. FLOATING LAUNCHER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-[#13171E] hover:bg-[#1A202A] text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl hover:shadow-cyan-900/20 transition-all duration-300 transform hover:-translate-y-0.5 border border-slate-700/60"
          title="Chat with Jim (AI Assistant)"
        >
          {/* Avatar */}
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#13171E] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-300" />
            </div>
            <span className="absolute 0 top-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#13171E] animate-pulse"></span>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white tracking-tight">Jim</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                AI
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium block">
              Virtual Assistant
            </span>
          </div>
        </button>
      )}

      {/* 2. EXACT SCREENSHOT CHAT WINDOW */}
      {isOpen && (
        <div className="w-[360px] sm:w-[390px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Top Dark Header */}
          <div className="bg-[#13171E] text-white px-4 py-3 flex items-center justify-between relative select-none">
            <div className="flex items-center gap-3">
              {/* Back button */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white p-1 -ml-1 rounded-lg hover:bg-white/10 transition"
                title="Back / Close"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Bot Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-full bg-[#13171E] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-300" />
                </div>
              </div>

              {/* Name & Title */}
              <div>
                <h3 className="font-bold text-sm text-white leading-tight">Jim</h3>
                <p className="text-[11px] text-slate-400 font-normal">AI Assistant</p>
              </div>
            </div>

            {/* Right Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowMenu((prev) => !prev)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
                title="Menu"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                  <button
                    onClick={handleClearChat}
                    className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-100 flex items-center gap-2 font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Clear Conversation</span>
                  </button>
                  {onOpenHelplines && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onOpenHelplines();
                      }}
                      className="w-full text-left px-3.5 py-2 text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                      <span>Emergency Helplines</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white text-xs">
            {messages.map((msg) => {
              const isUser = msg.role === "user";

              return (
                <div key={msg.id} className="space-y-1">
                  {/* Assistant Message Layout */}
                  {!isUser && (
                    <div className="space-y-1">
                      {/* Timestamp above bubble */}
                      <div className="flex items-center gap-2 pl-9 text-[11px] text-slate-400 font-normal">
                        <span>{msg.timestamp}</span>
                      </div>

                      <div className="flex items-start gap-2.5">
                        {/* Small Bot Avatar */}
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 p-0.5 shrink-0 mt-0.5">
                          <div className="w-full h-full rounded-full bg-[#13171E] flex items-center justify-center">
                            <Bot className="w-3.5 h-3.5 text-cyan-300" />
                          </div>
                        </div>

                        {/* Speech Bubble */}
                        <div className="max-w-[85%] bg-[#EEF2F6] text-[#242D38] rounded-2xl rounded-tl-sm px-4 py-3 leading-relaxed shadow-2xs font-normal">
                          <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User Message Layout */}
                  {isUser && (
                    <div className="space-y-1 flex flex-col items-end">
                      {/* Timestamp above user bubble */}
                      <div className="text-[11px] text-slate-400 font-normal pr-1">
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Speech Bubble */}
                      <div className="max-w-[85%] bg-[#1E2228] text-white rounded-2xl rounded-tr-sm px-4 py-3 leading-relaxed shadow-xs font-normal">
                        <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 pl-9 text-[11px] text-slate-400">
                  <span>typing...</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 p-0.5 shrink-0">
                    <div className="w-full h-full rounded-full bg-[#13171E] flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-cyan-300" />
                    </div>
                  </div>
                  <div className="bg-[#EEF2F6] text-slate-600 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
                    <span>Jim is checking live {selectedCity.name} data...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Floating Input Bar */}
          <div className="p-3 bg-white border-t border-slate-100 flex flex-col items-center gap-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="w-full flex items-center gap-2"
            >
              {/* Paperclip Button */}
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-[#EEF2F6] hover:bg-[#E2E8F0] text-slate-600 flex items-center justify-center shrink-0 transition"
                title="Attach file / reference"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Pill Input with Smiley icon */}
              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Write.."
                  disabled={loading}
                  className="w-full bg-white border border-slate-200/90 rounded-full pl-4 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition shadow-2xs"
                />
                <button
                  type="button"
                  className="absolute right-3 text-slate-400 hover:text-slate-600 transition"
                  title="Emoji"
                >
                  <Smile className="w-4 h-4" />
                </button>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-full bg-[#EEF2F6] hover:bg-slate-200 disabled:opacity-40 text-slate-800 flex items-center justify-center shrink-0 transition shadow-2xs"
                title="Send Message"
              >
                <Send className="w-4 h-4 text-slate-800 ml-0.5" />
              </button>
            </form>

            {/* Bottom Subtitle / Branding */}
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <span>Powered by</span>
              <span className="font-semibold text-slate-600">Groq AI</span>
              <span>⚡</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
