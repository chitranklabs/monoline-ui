import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const ACCENT_COOKIE = "monoline-accent"
const VALID_ACCENTS = ["neutral", "zinc", "stone", "slate"]

export function middleware(request: NextRequest) {
	const { searchParams } = request.nextUrl
	const accentParam = searchParams.get("accent")

	// If accent is in query param, persist to cookie
	if (accentParam && VALID_ACCENTS.includes(accentParam)) {
		const response = NextResponse.next()
		response.cookies.set(ACCENT_COOKIE, accentParam, {
			path: "/",
			maxAge: 60 * 60 * 24 * 365, // 1 year
			sameSite: "lax",
		})
		return response
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
