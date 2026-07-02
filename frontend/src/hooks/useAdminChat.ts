"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { chatApi } from "@/lib/api";
import { buildWsUrl } from "@/lib/ws";

export interface ChatMessage {
  id: string;
  roomId: string;
  sender: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export interface ChatRoom {
  roomId: string;
  clientName: string;
  lastMessage: string;
  lastMessageAt: string | null;
  lastSender: string;
  messageCount: number;
}

type WsStatus = "connecting" | "connected" | "disconnected";

export function useAdminChat() {
  const [rooms, setRooms]               = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages]         = useState<ChatMessage[]>([]);
  const [newMsg, setNewMsg]             = useState("");
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMsgs, setLoadingMsgs]   = useState(false);
  const [sending, setSending]           = useState(false);
  const [wsStatus, setWsStatus]         = useState<WsStatus>("disconnected");

  const ws              = useRef<WebSocket | null>(null);
  const chatEndRef      = useRef<HTMLDivElement | null>(null);
  const inputRef        = useRef<HTMLInputElement | null>(null);
  const selectedRoomRef = useRef<ChatRoom | null>(null);

  // Keep ref in sync so WS handler always sees latest room
  useEffect(() => { selectedRoomRef.current = selectedRoom; }, [selectedRoom]);

  // ── Fetch room list ──────────────────────────────────────────────────────────
  const fetchRooms = useCallback(async () => {
    try {
      const json = await chatApi.getRooms() as { success: boolean; data: ChatRoom[] };
      if (json.success) setRooms(json.data);
    } catch { /* silent */ }
    finally { setLoadingRooms(false); }
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  // ── WebSocket (admin role) ───────────────────────────────────────────────────
  useEffect(() => {
    setWsStatus("connecting");
    const sock = new WebSocket(`${buildWsUrl()}?role=admin`);
    ws.current = sock;

    sock.onopen  = () => setWsStatus("connected");
    sock.onclose = () => setWsStatus("disconnected");
    sock.onerror = () => setWsStatus("disconnected");

    sock.onmessage = (e) => {
      try {
        const payload: ChatMessage & { type: string } = JSON.parse(e.data);
        if (payload.type !== "message") return;

        // Append to open chat if it belongs to the selected room
        setMessages((prev) => {
          if (prev.some((m) => m.id === payload.id)) return prev;
          if (selectedRoomRef.current?.roomId === payload.roomId) {
            return [...prev, payload];
          }
          return prev;
        });

        // Update room list preview
        setRooms((prev) => {
          const idx = prev.findIndex((r) => r.roomId === payload.roomId);
          if (idx === -1) { fetchRooms(); return prev; }
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            lastMessage:   payload.text,
            lastMessageAt: payload.createdAt,
            lastSender:    payload.sender,
            messageCount:  updated[idx].messageCount + 1,
          };
          return updated.sort((a, b) =>
            (b.lastMessageAt ?? "").localeCompare(a.lastMessageAt ?? "")
          );
        });
      } catch { /* ignore malformed frames */ }
    };

    return () => sock.close();
  }, [fetchRooms]);

  // ── Load messages when a room is selected ───────────────────────────────────
  useEffect(() => {
    if (!selectedRoom) return;
    setLoadingMsgs(true);
    setMessages([]);
    chatApi.getMessages(selectedRoom.roomId)
      .then((res) => { const json = res as { success: boolean; data: ChatMessage[] }; if (json.success) setMessages(json.data); })
      .catch(() => {})
      .finally(() => setLoadingMsgs(false));
    inputRef.current?.focus();
  }, [selectedRoom]);

  // ── Auto-scroll ──────────────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send a message ───────────────────────────────────────────────────────────
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = newMsg.trim();
    if (!text || !selectedRoom || sending) return;

    const payload = {
      type:       "message",
      roomId:     selectedRoom.roomId,
      sender:     "admin",
      senderName: "Admin",
      text,
    };

    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(payload));
      setNewMsg("");
    } else {
      // REST fallback when WS is not available
      setSending(true);
      chatApi.sendMessage(payload)
        .then((res) => {
          const json = res as { success: boolean; data: ChatMessage };
          if (json.success) setMessages((prev) => [...prev, json.data]);
        })
        .finally(() => { setSending(false); setNewMsg(""); });
    }
  };

  return {
    rooms, selectedRoom, setSelectedRoom,
    messages,
    newMsg, setNewMsg,
    loadingRooms, loadingMsgs,
    sending, wsStatus,
    sendMessage,
    chatEndRef, inputRef,
  };
}
