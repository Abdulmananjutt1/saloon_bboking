import { Router, Request, Response } from "express";
import prisma from "../db";

const router = Router();

// ── GET /chat/rooms ─────────────────────────────
// Returns all distinct rooms (one per client email) with last message + unread count.
// Used by the admin chat panel to show the conversation list.
router.get("/rooms", async (_req: Request, res: Response) => {
  try {
    // Group messages by roomId, get last message and total count
    const rooms = await prisma.chatMessage.groupBy({
      by: ["roomId"],
      _max: { createdAt: true },
      _count: { id: true },
      orderBy: { _max: { createdAt: "desc" } },
    });

    // For each room, fetch the last message text + sender
    const roomsWithPreview = await Promise.all(
      rooms.map(async (room: any) => {
        const lastMsg = await prisma.chatMessage.findFirst({
          where: { roomId: room.roomId },
          orderBy: { createdAt: "desc" },
        });
        return {
          roomId: room.roomId,
          clientName: lastMsg?.sender === "admin" ? room.roomId : (lastMsg?.senderName ?? room.roomId),
          lastMessage: lastMsg?.text ?? "",
          lastMessageAt: lastMsg?.createdAt ?? null,
          lastSender: lastMsg?.sender ?? "",
          messageCount: room._count.id,
        };
      })
    );

    res.json({ success: true, data: roomsWithPreview });
  } catch (err) {
    console.error("[GET /chat/rooms]", err);
    res.status(500).json({ success: false, error: "Failed to fetch chat rooms" });
  }
});

// ── GET /chat/messages?roomId=xxx ───────────────
// Returns full message history for a specific room.
router.get("/messages", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.query as { roomId: string };
    if (!roomId) {
      return res.status(400).json({ success: false, error: "roomId is required" });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
      take: 200, // last 200 messages
    });

    res.json({ success: true, data: messages });
  } catch (err) {
    console.error("[GET /chat/messages]", err);
    res.status(500).json({ success: false, error: "Failed to fetch messages" });
  }
});

// ── POST /chat/messages ──────────────────────────
// REST fallback to send a message (used as a backup if WS is unavailable).
router.post("/messages", async (req: Request, res: Response) => {
  try {
    const { roomId, sender, senderName, text } = req.body as {
      roomId: string;
      sender: string;
      senderName: string;
      text: string;
    };

    if (!roomId || !sender || !text?.trim()) {
      return res.status(400).json({ success: false, error: "roomId, sender, and text are required" });
    }

    const message = await prisma.chatMessage.create({
      data: { roomId, sender, senderName: senderName ?? sender, text: text.trim() },
    });

    res.status(201).json({ success: true, data: message });
  } catch (err) {
    console.error("[POST /chat/messages]", err);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
});

export default router;
