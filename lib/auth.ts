export function assertAdmin(req: Request) {
  const key =
    req.headers.get("x-admin-key") ||
    new URL(req.url).searchParams.get("adminKey");

  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    throw new Response("Unauthorized", { status: 401 });
  }
}

export function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  );
}