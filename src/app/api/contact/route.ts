import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { turnstileToken, ...formData } = body;

  // Verify Turnstile token
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Turnstile secret key not configured" },
      { status: 500 }
    );
  }

  const verifyRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: turnstileToken || "",
      }),
    }
  );

  const verifyData = await verifyRes.json();

  if (!verifyData.success) {
    return NextResponse.json(
      { error: "Turnstile verification failed" },
      { status: 403 }
    );
  }

  // Forward to Google Sheets
  const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    console.log("Form data (Google Script URL not configured):", formData);
    return NextResponse.json({ status: "success" });
  }

  try {
    await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, timestamp: new Date().toISOString() }),
    });

    return NextResponse.json({ status: "success" });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit to Google Sheets" },
      { status: 500 }
    );
  }
}
