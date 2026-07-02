"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ROUTES, type BookingStatus } from "@/constants";
import { bookingsApi, chatApi } from "@/lib/api";
import { buildWsUrl } from "@/lib/ws";
import { getSession, clearSession, pushSessionToast } from "@/lib/session";

export interface ClientBooking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  stylistId: string;
  stylistName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderName: string;
  text: string;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

type WsStatus = "connecting" | "connected" | "disconnected";

// LocalStorage key for persisting last-read message count per client
const LAST_READ_KEY = "gs_chat_last_read";

export function useClientDashboard() {
  const [user, setUser]           = useState<{ name: string; email: string; phone: string } | null>(null);
  const [bookings, setBookings]   = useState<ClientBooking[]>([]);
  const [loading, setLoading]     = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage]     = useState("");
  const [wsStatus, setWsStatus]         = useState<WsStatus>("disconnected");

  // Unread count — messages from admin not yet seen
  const [unreadCount, setUnreadCount] = useState(0);
  const chatOpenRef = useRef(false);

  const ws         = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // ── Data fetchers (defined before useEffect that calls them) ─────────────────
  const fetchBookings = useCallback(async (email: string) => {
    try {
      const data = await bookingsApi.getAll(undefined, email) as ApiResponse<ClientBooking[]>;
      if (data.success) setBookings(data.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  const fetchChatHistory = useCallback(async (email: string) => {
    try {
      const data = await chatApi.getMessages(email) as ApiResponse<ChatMessage[]>;
      if (data.success) setChatMessages(data.data);
    } catch { /* ignore */ }
  }, []);

  // ── Bootstrap: read user from localStorage, redirect if not logged in ────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    const parsed = getSession();
    if (!parsed) {
      window.location.href = ROUTES.LOGIN;
      return;
    }
    const id = requestAnimationFrame(() => setUser(parsed));
    fetchBookings(parsed.email);
    fetchChatHistory(parsed.email);
    return () => cancelAnimationFrame(id);
  }, [fetchBookings, fetchChatHistory]);

  // ── WebSocket (client role) ──────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const id = requestAnimationFrame(() => setWsStatus("connecting"));
    const sock = new WebSocket(
      `${buildWsUrl()}?role=client&roomId=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name)}`
    );
    ws.current = sock;

    sock.onopen  = () => setWsStatus("connected");
    sock.onclose = () => setWsStatus("disconnected");
    sock.onerror = () => setWsStatus("disconnected");

    sock.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data) as ChatMessage & { type: string };
        if (payload.type === "message") {
          setChatMessages((prev) => {
            if (prev.some((m) => m.id === payload.id)) return prev;
            // If message is from admin and chat is not currently open → increment unread
            if (payload.sender === "admin" && !chatOpenRef.current) {
              setUnreadCount((c) => c + 1);
            }
            return [...prev, payload];
          });
        }
      } catch { /* ignore */ }
    };

    return () => {
      cancelAnimationFrame(id);
      sock.close();
    };
  }, [user]);

  // ── Auto-scroll chat ─────────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // ── Compute unread from loaded history ──────────────────────────────────────
  useEffect(() => {
    if (!user || chatMessages.length === 0) return;
    const key      = `${LAST_READ_KEY}_${user.email}`;
    const lastRead = parseInt(localStorage.getItem(key) ?? "0", 10);
    const adminMsgs = chatMessages.filter(
      (m) => m.sender === "admin" && new Date(m.createdAt).getTime() > lastRead
    );
    if (!chatOpenRef.current) {
      setUnreadCount(adminMsgs.length);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessages]);

  // ── Mark chat as read ────────────────────────────────────────────────────────
  const markChatRead = () => {
    if (!user) return;
    chatOpenRef.current = true;
    setUnreadCount(0);
    const key = `${LAST_READ_KEY}_${user.email}`;
    localStorage.setItem(key, Date.now().toString());
  };

  const markChatClosed = () => {
    chatOpenRef.current = false;
  };

  // ── Actions ──────────────────────────────────────────────────────────────────
  const cancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    setCancellingId(id);
    try {
      const data = await bookingsApi.updateStatus(id, "cancelled") as ApiResponse<ClientBooking>;
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
        );
      } else {
        alert(data.error ?? "Failed to cancel booking.");
      }
    } catch {
      alert("Network error. Please check your connection.");
    } finally {
      setCancellingId(null);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text || !user) return;

    const payload = {
      type:       "message",
      roomId:     user.email,
      sender:     user.email,
      senderName: user.name,
      text,
    };

    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(payload));
    } else {
      // REST fallback
      chatApi.sendMessage(payload)
        .then((json: ApiResponse<ChatMessage>) => {
          if (json.success) setChatMessages((prev) => [...prev, json.data]);
        });
    }
    setNewMessage("");
  };

  const logout = () => {
    clearSession();
    pushSessionToast("success", "Logged Out", "You have been logged out successfully.");
    window.location.href = ROUTES.LOGIN;
  };

  // ── Derived data ─────────────────────────────────────────────────────────────
  const upcomingBookings = bookings.filter((b) => b.status === "pending" || b.status === "confirmed");
  const pastBookings     = bookings.filter((b) => b.status === "completed" || b.status === "cancelled");
  const completedCount   = bookings.filter((b) => b.status === "completed").length;
  const totalSpent       = bookings.filter((b) => b.status === "completed").reduce((s, b) => s + b.price, 0);
  const loyaltyPoints    = completedCount * 10;

  return {
    user, loading,
    bookings, upcomingBookings, pastBookings,
    cancellingId, cancelBooking,
    totalSpent, loyaltyPoints, totalBookings: bookings.length,
    chatMessages, newMessage, setNewMessage,
    wsStatus, sendMessage, chatEndRef,
    unreadCount, markChatRead, markChatClosed,
    logout,
  };
}
