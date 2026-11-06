export function GET() {
  return Response.json({
    status: "ok",
    service: "Glamour Studio API",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
  });
}
