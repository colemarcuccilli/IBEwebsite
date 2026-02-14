import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getClearCookieOptions } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const opts = getClearCookieOptions();
  cookieStore.set(opts.name, opts.value, {
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
    path: opts.path,
    maxAge: opts.maxAge,
  });

  return NextResponse.json({ success: true });
}
