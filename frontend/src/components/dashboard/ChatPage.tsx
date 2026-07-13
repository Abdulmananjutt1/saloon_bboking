"use client";

import { ChatTab } from "./ChatTab";
import { useDashboardContext } from "./DashboardContext";

export default function ChatPage() {
  const { wsStatus, chatMessages, user, newMessage, setNewMessage, sendMessage, chatEndRef } = useDashboardContext();

  if (!user) return null;

  return (
    <ChatTab
      wsStatus={wsStatus}
      chatMessages={chatMessages}
      userEmail={user.email}
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      sendMessage={sendMessage}
      chatEndRef={chatEndRef}
    />
  );
}
