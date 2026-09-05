import JsonLd, {
	createBreadcrumbJsonLd,
	createTechArticleJsonLd,
} from "./json-ld"

interface DocsArticleJsonLdProps {
	title: string
	description: string
	path: `/${string}`
	section: "Foundations" | "Installation"
	sectionPath: `/${string}`
}

export function DocsArticleJsonLd({
	title,
	description,
	path,
	section,
	sectionPath,
}: DocsArticleJsonLdProps) {
	return (
		<JsonLd
			data={{
				"@context": "https://schema.org",
				"@graph": [
					createTechArticleJsonLd({ title, description, path }),
					createBreadcrumbJsonLd([
						{ name: "Monoline UI", path: "/" },
						{ name: section, path: sectionPath },
						...(path === sectionPath ? [] : [{ name: title, path }]),
					]),
				],
			}}
		/>
	)
}
