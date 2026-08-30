import { type NextRequest, NextResponse } from "next/server"

import { siteUrl } from "./app/lib/seo"

const canonicalHost = new URL(siteUrl).host

export function proxy(request: NextRequest) {
	const forwardedHost = request.headers.get("x-forwarded-host")
	const host = (forwardedHost ?? request.headers.get("host") ?? "").split(
		","
	)[0]
	const forwardedProtocol = request.headers
		.get("x-forwarded-proto")
		?.split(",")[0]

	if (host === `www.${canonicalHost}` || forwardedProtocol === "http") {
		const destination = request.nextUrl.clone()
		destination.protocol = "https:"
		destination.hostname = canonicalHost
		destination.port = ""
		return NextResponse.redirect(destination, 308)
	}

	const response = NextResponse.next()
	if (
		request.nextUrl.search.length > 0 ||
		(host.endsWith(".vercel.app") && host !== canonicalHost)
	) {
		response.headers.set("X-Robots-Tag", "noindex, follow")
	}

	return response
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|monoline-ui-og.jpg|robots.txt|sitemap.xml|manifest.webmanifest).*)",
	],
}
