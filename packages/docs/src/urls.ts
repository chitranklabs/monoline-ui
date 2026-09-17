export function routeHref(
	route: string,
	base: string,
	cleanUrls = false
): string {
	return base + (route === "/" ? "" : route.slice(1) + (cleanUrls ? "" : "/"))
}

export function pageFile(route: string, cleanUrls = false): string {
	if (route === "/") return "index.html"
	return cleanUrls ? `${route.slice(1)}.html` : `${route.slice(1)}/index.html`
}
