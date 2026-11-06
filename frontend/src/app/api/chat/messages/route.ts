import { NextRequest } from "next/server";
import prisma from "@/server/db";

export async function GET(req: NextRequest) {
  try {
    const roomId = req.nextUrl.searchParams.get("roomId");
    if (!roomId) {
      return Response.json({ success: false, error: "roomId is required" }, { status: 400 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
      take: 200,
    });

    return Response.json({ success: true, data: messages });
  } catch (err) {
    console.error("[GET /api/chat/messages]", err);
    return Response.json({ success: false, error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { roomId, sender, senderName, text } = await req.json() as {
      roomId: string;
      sender: string;
      senderName: string;
      text: string;
    };

    if (!roomId || !sender || !text?.trim()) {
      return Response.json({ success: false, error: "roomId, sender, and text are required" }, { status: 400 });
    }

    const message = await prisma.chatMessage.create({
      data: { roomId, sender, senderName: senderName ?? sender, text: text.trim() },
    });

    return Response.json({ success: true, data: message }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/chat/messages]", err);
    return Response.json({ success: false, error: "Failed to send message" }, { status: 500 });
  }
}
