"use client";

import { useState } from "react";
import { MessageSquare, Send, Search, Users } from "lucide-react";
import { useAdminChat } from "@/hooks/useAdminChat";
import { useAdminUnread } from "@/hooks/useAdminUnread";

const fmtTime = (iso: string | null) => {
  if (!iso) return "";
  const d      = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  if (diffMs < 86_400_000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function AdminChatPage() {
  const [search, setSearch] = useState("");

  const {
    rooms, selectedRoom, setSelectedRoom,
    messages,
    newMsg, setNewMsg,
    loadingRooms, loadingMsgs,
    sending, wsStatus,
    sendMessage,
    chatEndRef, inputRef,
  } = useAdminChat();

  const { unreadMap, markRoomRead, markRoomClosed } = useAdminUnread();

  const filtered = rooms.filter((r) =>
    r.clientName.toLowerCase().includes(search.toLowerCase()) ||
    r.roomId.toLowerCase().includes(search.toLowerCase())
  );

  // When admin selects a room → mark it as read
  const handleSelectRoom = (room: typeof rooms[0]) => {
    if (selectedRoom) markRoomClosed(selectedRoom.roomId);
    setSelectedRoom(room);
    markRoomRead(room.roomId);
  };

  return (
    <div style={{ maxWidth: 1280, width: "100%", margin: "0 auto", height: "100%", minHeight: 0, display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(201,151,59,0.1)", border: "1px solid rgba(201,151,59,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MessageSquare style={{ width: 18, height: 18, color: "var(--gold)" }} />
          </div>
          <div>
            <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", fontFamily: "var(--font-display), Georgia, serif" }}>
              Client Chat
            </h1>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Real-time messaging with clients</p>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, minHeight: 0 }}>

        {/* ── Rooms Panel ── */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Search */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-light)", flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              <Search style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "var(--text-muted)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients…"
                style={{
                  width: "100%", padding: "9px 12px 9px 32px",
                  borderRadius: 10, border: "1px solid var(--border-light)",
                  background: "var(--bg-secondary)", color: "var(--text-primary)",
                  fontSize: "0.8rem", outline: "none", boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          {/* Room list */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loadingRooms ? (
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 8 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ padding: "12px", borderRadius: 12, background: "var(--bg-secondary)", height: 60, animation: "pulse 1.4s ease-in-out infinite" }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "40px 16px", textAlign: "center" }}>
                <Users style={{ width: 32, height: 32, color: "var(--text-muted)", margin: "0 auto 12px" }} />
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  {rooms.length === 0 ? "No conversations yet.\nClients will appear here when they send a message." : "No results found."}
                </p>
              </div>
            ) : (
              filtered.map((room) => {
                const isActive  = selectedRoom?.roomId === room.roomId;
                const initial   = (room.clientName ?? room.roomId).charAt(0).toUpperCase();
                const unread    = unreadMap[room.roomId] ?? 0;
                return (
                  <button
                    key={room.roomId}
                    onClick={() => handleSelectRoom(room)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, width: "100%",
                      padding: "12px 16px", border: "none", cursor: "pointer", textAlign: "left",
                      background: isActive ? "rgba(201,151,59,0.08)" : "transparent",
                      borderLeft: isActive ? "3px solid var(--gold)" : "3px solid transparent",
                      borderBottom: "1px solid var(--border-light)", transition: "all 0.15s"
                    }}
                  >
                    {/* Avatar with unread dot */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: "rgba(201,151,59,0.15)", border: "1.5px solid rgba(201,151,59,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.85rem", fontWeight: 800, color: "var(--gold)"
                      }}>
                        {initial}
                      </div>
                      {unread > 0 && (
                        <span style={{
                          position: "absolute", top: -3, right: -3,
                          minWidth: 16, height: 16, borderRadius: 99,
                          background: "#ef4444",
                          color: "#fff", fontSize: "0.55rem", fontWeight: 900,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          padding: "0 4px",
                          border: "1.5px solid var(--bg-secondary)",
                          boxShadow: "0 2px 6px rgba(239,68,68,0.5)"
                        }}>
                          {unread > 99 ? "99+" : unread}
                        </span>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                        <p style={{
                          fontSize: "0.82rem",
                          fontWeight: unread > 0 ? 800 : 700,
                          color: isActive ? "var(--gold-light)" : unread > 0 ? "var(--text-primary)" : "var(--text-primary)",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "60%"
                        }}>
                          {room.clientName !== room.roomId ? room.clientName : room.roomId.split("@")[0]}
                        </p>
                        <span style={{ fontSize: "0.63rem", color: "var(--text-muted)", flexShrink: 0 }}>
                          {fmtTime(room.lastMessageAt)}
                        </span>
                      </div>
                      <p style={{
                        fontSize: "0.72rem",
                        color: unread > 0 ? "var(--text-secondary)" : "var(--text-muted)",
                        fontWeight: unread > 0 ? 600 : 400,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                      }}>
                        {room.lastSender === "admin" ? "You: " : ""}{room.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── Chat Panel ── */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {!selectedRoom ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(201,151,59,0.08)", border: "1px solid rgba(201,151,59,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MessageSquare style={{ width: 28, height: 28, color: "var(--gold)" }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>Select a conversation</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Choose a client from the left panel to start chatting.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "rgba(201,151,59,0.15)", border: "1.5px solid rgba(201,151,59,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.85rem", fontWeight: 800, color: "var(--gold)"
                }}>
                  {(selectedRoom.clientName ?? selectedRoom.roomId).charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    {selectedRoom.clientName !== selectedRoom.roomId ? selectedRoom.clientName : selectedRoom.roomId.split("@")[0]}
                  </p>
                  <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{selectedRoom.roomId}</p>
                </div>
                <div style={{ marginLeft: "auto", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  {selectedRoom.messageCount} messages
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
                {loadingMsgs ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[0, 1, 2].map((i) => (
                      <div key={i} style={{ display: "flex", justifyContent: i % 2 === 0 ? "flex-start" : "flex-end" }}>
                        <div style={{ height: 40, width: 200, borderRadius: 12, background: "var(--border-light)", animation: "pulse 1.4s ease-in-out infinite" }} />
                      </div>
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isAdmin = m.sender === "admin";
                    return (
                      <div key={m.id} style={{ display: "flex", justifyContent: isAdmin ? "flex-end" : "flex-start" }}>
                        <div style={{ maxWidth: "65%" }}>
                          {!isAdmin && (
                            <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 4, marginLeft: 4 }}>
                              {m.senderName}
                            </p>
                          )}
                          <div style={{
                            padding: "12px 16px",
                            borderRadius: isAdmin ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                            background: isAdmin ? "var(--grad-gold-btn)" : "rgba(255,255,255,0.04)",
                            border: isAdmin ? "none" : "1px solid var(--border-light)",
                            color: isAdmin ? "#0d0c0a" : "var(--text-primary)",
                            boxShadow: isAdmin ? "0 4px 12px rgba(201,151,59,0.2)" : "none"
                          }}>
                            <p style={{ fontSize: "0.85rem", lineHeight: 1.5 }}>{m.text}</p>
                            <p style={{ fontSize: "0.6rem", marginTop: 6, textAlign: "right", opacity: 0.6 }}>
                              {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} style={{ padding: "16px 20px", borderTop: "1px solid var(--border-light)", display: "flex", gap: 10, flexShrink: 0 }}>
                <input
                  ref={inputRef}
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder={`Message ${selectedRoom.clientName !== selectedRoom.roomId ? selectedRoom.clientName : selectedRoom.roomId.split("@")[0]}…`}
                  style={{
                    flex: 1, padding: "13px 18px", borderRadius: 12,
                    background: "var(--bg-secondary)", border: "1px solid var(--border-light)",
                    color: "var(--text-primary)", fontSize: "0.85rem", outline: "none"
                  }}
                />
                <button
                  type="submit"
                  disabled={!newMsg.trim() || sending}
                  style={{
                    width: 48, height: 48, borderRadius: 12, border: "none",
                    background: newMsg.trim() ? "var(--grad-gold-btn)" : "var(--bg-secondary)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: newMsg.trim() ? "pointer" : "not-allowed",
                    transition: "all 0.2s", flexShrink: 0,
                    boxShadow: newMsg.trim() ? "0 4px 12px rgba(201,151,59,0.25)" : "none"
                  }}
                >
                  <Send style={{ width: 17, height: 17, color: newMsg.trim() ? "#0d0c0a" : "var(--text-muted)" }} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>
    </div>
  );
}
