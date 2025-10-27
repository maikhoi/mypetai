import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mypetai-secret-key";
const COOKIE_NAME = process.env.ADMIN_SESSION_COOKIE || "admin_session";

export async function getAdminUser() {
  const cookieStore = await cookies(); // ✅ await here
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; role?: string };
    return decoded;
  } catch {
    return null;
  }
}
