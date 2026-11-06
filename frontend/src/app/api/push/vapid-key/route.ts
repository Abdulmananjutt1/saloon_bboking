import { VAPID_PUBLIC_KEY } from "@/server/lib/config";

export function GET() {
  return Response.json({ success: true, publicKey: VAPID_PUBLIC_KEY });
}
