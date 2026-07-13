import type { FormEvent, RefObject } from "react";
import { MessageSquare, Send } from "lucide-react";
import type { ChatMessage } from "@/hooks/useClientDashboard";
import { pageSubtitleStyle, pageTitleStyle } from "./styles";

type ChatTabProps = {
  wsStatus: "connecting" | "connected" | "disconnected";
  chatMessages: ChatMessage[];
  userEmail?: string;
  newMessage: string;
  setNewMessage: (value: string) => void;
  sendMessage: (event: FormEvent) => void;
  chatEndRef: RefObject<HTMLDivElement | null>;
};

export function ChatTab({
  wsStatus,
  chatMessages,
  userEmail,
  newMessage,
  setNewMessage,
  sendMessage,
  chatEndRef,
}: ChatTabProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, animation: "fadeIn 0.3s ease-out" }}>
      <div className="client-dashboard-page-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={pageTitleStyle}>Support Chat</h1>
          <p style={pageSubtitleStyle}>Chat with Glamour Studio support</p>
        </div>
      </div>

      <div style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--grad-gold-btn)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 800, color: "#0d0c0a" }}>
            GS
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>Glamour Studio Support</h4>
            <p style={{ fontSize: "0.7rem", color: "var(--gold)", marginTop: 2 }}>Typically replies in a few minutes</p>
          </div>
          {chatMessages.length > 0 && (
            <span style={{
              fontSize: "0.68rem", color: "var(--text-muted)",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-light)",
              padding: "3px 10px", borderRadius: 99,
            }}>
              {chatMessages.length} message{chatMessages.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
          {chatMessages.length === 0 ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <MessageSquare style={{ width: 32, height: 32, color: "var(--text-muted)" }} />
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Send a message to start the conversation.</p>
            </div>
          ) : (
            chatMessages.map((m) => {
              const isUser = m.sender === userEmail;
              return (
                <div key={m.id} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                  {!isUser && (
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: "var(--grad-gold-btn)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.62rem", fontWeight: 800, color: "#0d0c0a",
                      marginRight: 8, alignSelf: "flex-end", marginBottom: 2,
                    }}>
                      GS
                    </div>
                  )}
                  <div style={{ maxWidth: "62%" }}>
                    {!isUser && (
                      <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 4, marginLeft: 2 }}>
                        Glamour Studio Support
                      </p>
                    )}
                    <div style={{
                      padding: "11px 15px",
                      borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: isUser ? "var(--grad-gold-btn)" : "var(--bg-secondary)",
                      border: isUser ? "none" : "1px solid var(--border-light)",
                      color: isUser ? "#0d0c0a" : "var(--text-primary)",
                      boxShadow: isUser ? "0 4px 12px rgba(201,151,59,0.2)" : "none",
                    }}>
                      <p style={{ fontSize: "0.85rem", lineHeight: 1.55, color: isUser ? "#0d0c0a" : "var(--text-primary)" }}>
                        {m.text}
                      </p>
                      <p style={{
                        fontSize: "0.6rem", marginTop: 5, textAlign: "right",
                        color: isUser ? "rgba(13,12,10,0.55)" : "var(--text-muted)",
                      }}>
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

        <form onSubmit={sendMessage} style={{ display: "flex", gap: 12, padding: "18px 20px", borderTop: "1px solid var(--border-light)", background: "var(--bg-card)" }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            style={{
              flex: 1, padding: "15px 20px", borderRadius: 14,
              background: "var(--bg-secondary)",
              border: "1.5px solid var(--border-light)",
              color: "var(--text-primary)",
              fontSize: "0.88rem", outline: "none",
              fontFamily: "inherit", minHeight: 52,
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = "rgba(201,151,59,0.5)"}
            onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-light)"}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || wsStatus !== "connected"}
            style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0, alignSelf: "center",
              background: newMessage.trim() && wsStatus === "connected" ? "var(--grad-gold-btn)" : "var(--bg-secondary)",
              border: newMessage.trim() && wsStatus === "connected" ? "none" : "1.5px solid var(--border-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: newMessage.trim() && wsStatus === "connected" ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow: newMessage.trim() && wsStatus === "connected" ? "0 4px 16px rgba(201,151,59,0.35)" : "none",
            }}
          >
            <Send style={{ width: 17, height: 17, color: newMessage.trim() && wsStatus === "connected" ? "#0d0c0a" : "var(--text-muted)" }} />
          </button>
        </form>
      </div>
    </div>
  );
}
