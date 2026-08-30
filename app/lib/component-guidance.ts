export const componentSlugs = [
	"action-rail",
	"avatar",
	"back-link",
	"badge",
	"button",
	"callout",
	"card",
	"changelog",
	"code-block",
	"command-search",
	"container",
	"data-list",
	"editorial-line",
	"eyebrow",
	"footer",
	"input",
	"link-list",
	"media-frame",
	"meta-row",
	"metric",
	"navbar",
	"progress",
	"pull-quote",
	"rail",
	"resources-panel",
	"section-head",
	"segmented-control",
	"select",
	"skeleton",
	"status",
	"tag",
	"testimonial",
	"testimonial-grid",
	"theme-switcher",
	"toast",
	"toc",
	"toggle",
] as const

export type ComponentSlug = (typeof componentSlugs)[number]

interface ComponentGuidance {
	runtime: "server" | "client"
	whenToUse: string
	whenToAvoid: string
	accessibility: string
	related: readonly [ComponentSlug, ComponentSlug]
}

export const componentGuidance = {
	"action-rail": {
		runtime: "server",
		whenToUse:
			"Use ActionRail to align a compact set of related buttons or links vertically or horizontally.",
		whenToAvoid:
			"Avoid ActionRail for primary navigation or for controls that need selection state managed by the container.",
		accessibility:
			"ActionRail renders only a div, so every child must retain its native control semantics and the rail needs an accessible group label when its relationship is not obvious.",
		related: ["button", "navbar"],
	},
	avatar: {
		runtime: "server",
		whenToUse:
			"Use Avatar for a compact person or account image with initials or other fallback content.",
		whenToAvoid:
			"Avoid Avatar for media that needs a caption, responsive art direction, or a non-circular presentation.",
		accessibility:
			"Avatar renders an img only when src is present, so provide a meaningful alt for an identifying portrait and leave alt empty when the image is decorative.",
		related: ["testimonial", "card"],
	},
	"back-link": {
		runtime: "server",
		whenToUse:
			"Use BackLink for a concise link that returns readers to a parent page or previous content level.",
		whenToAvoid:
			"Avoid BackLink for an in-place action or when browser history, rather than a stable destination, is the required behavior.",
		accessibility:
			"BackLink renders an anchor by default and hides its decorative line, so provide href and descriptive link text and preserve link semantics when overriding as.",
		related: ["button", "navbar"],
	},
	badge: {
		runtime: "server",
		whenToUse:
			"Use Badge for short, static classification text such as a category, version, or compact count.",
		whenToAvoid:
			"Avoid Badge for a selectable filter, a live system state, or prose that needs wrapping.",
		accessibility:
			"Badge renders a span and adds no announcement role, so its text must be self-explanatory and live changes need a separate status mechanism.",
		related: ["status", "tag"],
	},
	button: {
		runtime: "server",
		whenToUse:
			"Use Button for a discrete action, polymorphic action link, icon action, or loading submission state.",
		whenToAvoid:
			"Avoid Button for persistent on-off state, radio-style choices, or an entire clickable content card.",
		accessibility:
			"Button defaults to type button, exposes loading through aria-busy and aria-disabled, and requires an accessible name for icon-only use or any semantic element supplied through asChild.",
		related: ["action-rail", "toggle"],
	},
	callout: {
		runtime: "server",
		whenToUse:
			"Use Callout to separate a note, tip, or warning from surrounding documentation prose.",
		whenToAvoid:
			"Avoid Callout for transient notifications, validation errors, or content that should remain in the normal reading flow.",
		accessibility:
			"Callout renders an aside with a visible label but no live-region behavior, so urgent messages need an explicit alert strategy outside this component.",
		related: ["code-block", "section-head"],
	},
	card: {
		runtime: "server",
		whenToUse:
			"Use Card for a composed content summary that can remain static or become one link or one button action.",
		whenToAvoid:
			"Avoid Card when it would contain multiple independent interactive controls inside a clickable card root.",
		accessibility:
			"Card selects native anchor, button, or div semantics from href and onClick, defaults button cards to type button, and requires the chosen root to have a clear accessible name.",
		related: ["media-frame", "tag"],
	},
	changelog: {
		runtime: "server",
		whenToUse:
			"Use ChangelogTimeline to render grouped git-cliff releases with commit, pull-request, and author links.",
		whenToAvoid:
			"Avoid ChangelogTimeline for arbitrary event timelines or release data that cannot satisfy the GitCliffRelease shape.",
		accessibility:
			"ChangelogTimeline renders release h3 headings, group h4 headings, and commit lists, so place it beneath an h2 and keep generated link labels understandable in context.",
		related: ["editorial-line", "toc"],
	},
	"code-block": {
		runtime: "client",
		whenToUse:
			"Use CodeBlock for scrollable code examples that benefit from an optional filename and clipboard action.",
		whenToAvoid:
			"Avoid CodeBlock for inline code, executable editors, or syntax highlighting that has not already been produced by the caller.",
		accessibility:
			"CodeBlock renders figure, pre, and code elements with a keyboard-focusable scroll region and text-labeled copy buttons.",
		related: ["callout", "toc"],
	},
	"command-search": {
		runtime: "client",
		whenToUse:
			"Use CommandSearch for a controlled, keyboard-driven search or command palette with filterable actions.",
		whenToAvoid:
			"Avoid CommandSearch for a permanently visible search field or server-only results that have no client-side controller.",
		accessibility:
			"CommandSearch delegates command-list semantics to cmdk and closes on Escape, while the caller must provide an accessible opener and restore focus when the portal closes.",
		related: ["input", "resources-panel"],
	},
	container: {
		runtime: "server",
		whenToUse:
			"Use Container to apply a consistent responsive content width to a page or major section.",
		whenToAvoid:
			"Avoid Container for local flex or grid layout where a maximum page width is not part of the design.",
		accessibility:
			"Container is a div by default and accepts as for landmarks such as main or section, so choose the semantic element that matches the enclosed content.",
		related: ["section-head", "navbar"],
	},
	"data-list": {
		runtime: "server",
		whenToUse:
			"Use DataList for compact, consistently aligned rows of facts, milestones, or metadata.",
		whenToAvoid:
			"Avoid DataList for true tabular comparisons that need column headers or for navigation rows that should be anchors.",
		accessibility:
			"DataList items become native buttons only when onClick is supplied; static rows remain divs and must not be made focusable without complete keyboard behavior.",
		related: ["metric", "editorial-line"],
	},
	"editorial-line": {
		runtime: "server",
		whenToUse:
			"Use EditorialLine for a dated article, release, or project summary in a dense editorial index.",
		whenToAvoid:
			"Avoid EditorialLine for records without a meaningful title and date or for rows containing several actions.",
		accessibility:
			"EditorialLine renders one anchor when href is present and an article otherwise, with the supplied date placed in a time element.",
		related: ["link-list", "meta-row"],
	},
	eyebrow: {
		runtime: "server",
		whenToUse:
			"Use Eyebrow for a short category or context label immediately adjacent to a heading or content block.",
		whenToAvoid:
			"Avoid Eyebrow as a substitute for a real heading or for long explanatory text.",
		accessibility:
			"Eyebrow renders a span with no heading semantics, so the associated section still needs a correctly ranked heading.",
		related: ["section-head", "card"],
	},
	footer: {
		runtime: "server",
		whenToUse:
			"Use Footer for site-wide brand copy, grouped resource links, optional status, and a Server Action subscription form.",
		whenToAvoid:
			"Avoid Footer for page-local controls or when a minimal legal-only footer would be clearer.",
		accessibility:
			"Footer renders a footer landmark, labeled nav groups, native links, and a labeled email field and submit button in its subscription form.",
		related: ["link-list", "input"],
	},
	input: {
		runtime: "server",
		whenToUse:
			"Use Input for a single native text field with optional prefix, suffix, size, and error styling.",
		whenToAvoid:
			"Avoid Input for multi-line text, composite selection, or validation messaging that the component does not render.",
		accessibility:
			"Input wraps the native input in a label but provides no built-in label text, so supply an accessible name and describe errors with aria-invalid and aria-describedby when applicable.",
		related: ["select", "button"],
	},
	"link-list": {
		runtime: "server",
		whenToUse:
			"Use LinkList for a titled collection of editorial resources that may mix linked and static rows.",
		whenToAvoid:
			"Avoid LinkList for application menus, selectable options, or data requiring table semantics.",
		accessibility:
			"LinkList renders a section whose linked items are anchors and static items are articles, so provide a contextual title and descriptive item titles.",
		related: ["editorial-line", "resources-panel"],
	},
	"media-frame": {
		runtime: "server",
		whenToUse:
			"Use MediaFrame to reserve a stable ratio and styled boundary around an image, video, embed, or placeholder.",
		whenToAvoid:
			"Avoid MediaFrame when the media must retain an unconstrained intrinsic ratio or needs figure semantics without a custom asChild root.",
		accessibility:
			"MediaFrame is a visual div wrapper, so the nested media must provide its own alt text, controls, title, caption association, and other required semantics.",
		related: ["card", "meta-row"],
	},
	"meta-row": {
		runtime: "server",
		whenToUse:
			"Use MetaRow to keep short byline, date, category, or reading-time fragments on one responsive line.",
		whenToAvoid:
			"Avoid MetaRow for key-value data that needs explicit term and description relationships.",
		accessibility:
			"MetaRow renders a div and hides its decorative separators, so each child must carry its own link, time, or textual semantics.",
		related: ["eyebrow", "editorial-line"],
	},
	metric: {
		runtime: "server",
		whenToUse:
			"Use Metric for one prominent value with a compact label, optional trend, and explanatory sentence.",
		whenToAvoid:
			"Avoid Metric for continuous progress, dense analytical tables, or trends that require a chart.",
		accessibility:
			"Metric renders text in generic divs and represents trend with an arrow glyph, so add explicit spoken context when the trend direction carries meaning.",
		related: ["progress", "data-list"],
	},
	navbar: {
		runtime: "server",
		whenToUse:
			"Use Navbar for a responsive site header with brand, primary links, and optional actions.",
		whenToAvoid:
			"Avoid Navbar for application sidebars, nested navigation trees, or menus that require built-in disclosure state.",
		accessibility:
			"Navbar renders header and nav landmarks, supplies a nav label, and marks active links with aria-current page.",
		related: ["command-search", "button"],
	},
	progress: {
		runtime: "client",
		whenToUse:
			"Use Progress for determinate completion, indeterminate work, or document scroll progress.",
		whenToAvoid:
			"Avoid Progress when users need discrete steps, an exact editable value, or a static status label.",
		accessibility:
			"Progress exposes role progressbar and normalized value attributes, and callers must provide an accessible label or labelledby relationship.",
		related: ["status", "skeleton"],
	},
	"pull-quote": {
		runtime: "server",
		whenToUse:
			"Use PullQuote to emphasize a genuine quotation with optional attribution inside long-form content.",
		whenToAvoid:
			"Avoid PullQuote for decorative marketing copy that is not a quotation or for a full testimonial card.",
		accessibility:
			"PullQuote renders figure, blockquote, and optional figcaption elements so quotation and attribution retain native document semantics.",
		related: ["testimonial", "section-head"],
	},
	rail: {
		runtime: "server",
		whenToUse:
			"Use Rail for a compact vertical list with an optional title, active marker, and per-item counts.",
		whenToAvoid:
			"Avoid Rail as navigation unless its item content contains real links and the surrounding context supplies a navigation landmark.",
		accessibility:
			"Rail renders a div containing a ul and li elements, while its active dot is decorative and active state must also be conveyed in text or link semantics.",
		related: ["link-list", "toc"],
	},
	"resources-panel": {
		runtime: "server",
		whenToUse:
			"Use ResourcesPanel for a bounded group of source, package, documentation, design, or media resources.",
		whenToAvoid:
			"Avoid ResourcesPanel for primary site navigation or for unlabeled URLs with no user-facing purpose.",
		accessibility:
			"ResourcesPanel renders an aside with a list and native links, hides decorative icons, and needs a descriptive title for the complementary landmark.",
		related: ["link-list", "code-block"],
	},
	"section-head": {
		runtime: "server",
		whenToUse:
			"Use SectionHead for a consistent eyebrow, title, subtitle, and lede at the start of a page section.",
		whenToAvoid:
			"Avoid SectionHead when the content is not introducing a section or when a heading deeper than h3 is required.",
		accessibility:
			"SectionHead renders h1, h2, or h3 according to level, so choose the level from document structure rather than visual size.",
		related: ["eyebrow", "container"],
	},
	"segmented-control": {
		runtime: "client",
		whenToUse:
			"Use SegmentedControl for one mutually exclusive choice among a small, stable set of options.",
		whenToAvoid:
			"Avoid SegmentedControl for independent toggles, long option labels, or lists large enough to require a select.",
		accessibility:
			"SegmentedControl uses radiogroup and radio semantics with roving tab focus and arrow-key navigation, and the group still needs an accessible label.",
		related: ["toggle", "select"],
	},
	select: {
		runtime: "client",
		whenToUse:
			"Use Select for one choice from a moderate option set with responsive desktop popover and mobile sheet presentation.",
		whenToAvoid:
			"Avoid Select for native form submission without synchronization, multiple selection, or options that require arbitrary interactive content.",
		accessibility:
			"Select wires its trigger to a listbox, exposes options with aria-selected, and implements keyboard navigation, typeahead, focus management, and labeled trigger text.",
		related: ["input", "segmented-control"],
	},
	skeleton: {
		runtime: "server",
		whenToUse:
			"Use Skeleton to reserve stable visual space while known content is loading.",
		whenToAvoid:
			"Avoid Skeleton when the wait is long enough to need progress information or when its dimensions cannot match the final content.",
		accessibility:
			"Skeleton is always aria-hidden, so loading state and completion must be communicated by the surrounding region rather than the placeholder itself.",
		related: ["progress", "card"],
	},
	status: {
		runtime: "server",
		whenToUse:
			"Use Status for a compact, persistent textual state such as availability, health, or lifecycle stage.",
		whenToAvoid:
			"Avoid Status for a transient notification, binary control, or state conveyed only by the colored dot.",
		accessibility:
			"Status renders a text span and hides its decorative dot, but it is not a live region and will not announce dynamic changes automatically.",
		related: ["badge", "progress"],
	},
	tag: {
		runtime: "server",
		whenToUse:
			"Use Tag for a static chip or a pressed-state filter that toggles one independent criterion.",
		whenToAvoid:
			"Avoid Tag for navigation, mutually exclusive choices, or a switch whose state controls a persistent setting.",
		accessibility:
			"Interactive Tag renders a button with aria-pressed while static Tag renders a span, and asChild must preserve the equivalent semantics.",
		related: ["badge", "segmented-control"],
	},
	testimonial: {
		runtime: "server",
		whenToUse:
			"Use Testimonial for an attributed customer or collaborator quotation with optional portrait and role.",
		whenToAvoid:
			"Avoid Testimonial for unattributed decorative copy or a short quotation embedded directly in article prose.",
		accessibility:
			"Testimonial renders figure, blockquote, and figcaption semantics, hides the decorative quotation mark, and needs avatarAlt when the portrait conveys identity.",
		related: ["avatar", "pull-quote"],
	},
	"testimonial-grid": {
		runtime: "server",
		whenToUse:
			"Use TestimonialGrid to arrange multiple Testimonial components in a responsive grid or masonry-style flow.",
		whenToAvoid:
			"Avoid TestimonialGrid for unrelated cards or when reading order must differ from DOM order.",
		accessibility:
			"TestimonialGrid is a layout-only div, so DOM order must remain logical and every child must provide its own testimonial semantics.",
		related: ["testimonial", "card"],
	},
	"theme-switcher": {
		runtime: "client",
		whenToUse:
			"Use ThemeSwitcher for a controlled light-dark theme choice in compact button or full switch form.",
		whenToAvoid:
			"Avoid ThemeSwitcher when more than two themes exist or when theme persistence and document updates are not handled by the caller.",
		accessibility:
			"ThemeSwitcher supplies a state-specific accessible label and uses a native button in mini mode or a labeled switch in full mode.",
		related: ["toggle", "button"],
	},
	toast: {
		runtime: "server",
		whenToUse:
			"Use Toast for concise, non-blocking feedback with an optional dismiss action supplied from a client owner.",
		whenToAvoid:
			"Avoid Toast for destructive confirmations, persistent page guidance, or errors that require immediate interruption.",
		accessibility:
			"Toast renders role status with a text-labeled dismiss button, so urgent errors need alert semantics instead and dismissal requires a client boundary.",
		related: ["status", "callout"],
	},
	toc: {
		runtime: "client",
		whenToUse:
			"Use Toc for same-page heading links with active-section observation and optional compact disclosure.",
		whenToAvoid:
			"Avoid Toc for cross-page navigation or content whose target headings do not have stable unique ids.",
		accessibility:
			"Toc renders a nav with ordered fragment links, but its collapsible trigger currently does not expose aria-expanded or aria-controls.",
		related: ["rail", "section-head"],
	},
	toggle: {
		runtime: "client",
		whenToUse:
			"Use Toggle for one controlled or uncontrolled binary setting that takes effect immediately.",
		whenToAvoid:
			"Avoid Toggle for form submission choices, mutually exclusive groups, or actions that do not represent persistent on-off state.",
		accessibility:
			"Toggle renders a button with role switch and aria-checked, and callers must provide an accessible label describing the setting rather than the current action.",
		related: ["segmented-control", "theme-switcher"],
	},
} as const satisfies Record<ComponentSlug, ComponentGuidance>
