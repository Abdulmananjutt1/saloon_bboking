import prisma from "@/server/db";

export async function GET() {
  try {
    const rooms = await prisma.chatMessage.groupBy({
      by: ["roomId"],
      _max: { createdAt: true },
      _count: { id: true },
      orderBy: { _max: { createdAt: "desc" } },
    });

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

    return Response.json({ success: true, data: roomsWithPreview });
  } catch (err) {
    console.error("[GET /api/chat/rooms]", err);
    return Response.json({ success: false, error: "Failed to fetch chat rooms" }, { status: 500 });
  }
}
