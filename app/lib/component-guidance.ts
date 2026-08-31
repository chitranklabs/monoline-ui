export const componentSlugs = [
	"action-rail",
	"avatar",
	"back-link",
	"badge",
	"button",
	"callout",
	"card",
	"changelog",
	"checkbox",
	"code-block",
	"command-search",
	"container",
	"data-list",
	"dialog",
	"dropdown-menu",
	"editorial-line",
	"eyebrow",
	"field",
	"footer",
	"input",
	"label",
	"link-list",
	"media-frame",
	"meta-row",
	"metric",
	"navbar",
	"popover",
	"progress",
	"pull-quote",
	"radio-group",
	"rail",
	"resources-panel",
	"section-head",
	"segmented-control",
	"select",
	"separator",
	"skeleton",
	"status",
	"tag",
	"testimonial",
	"testimonial-grid",
	"textarea",
	"theme-switcher",
	"toast",
	"toc",
	"toggle",
	"tooltip",
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
	checkbox: {
		runtime: "client",
		whenToUse:
			"Checkbox represents an independent yes-or-no choice or a group-level indeterminate state.",
		whenToAvoid:
			"The available choices are mutually exclusive, or one switch changes a setting immediately.",
		accessibility:
			"Checkbox provides keyboard and checked-state semantics. Pair it with a visible Label and associate any description or validation message explicitly.",
		related: ["field", "radio-group"],
	},
	dialog: {
		runtime: "client",
		whenToUse:
			"Dialog is appropriate when a focused task must temporarily interrupt the page and keep interaction inside a modal surface.",
		whenToAvoid:
			"The content can remain in the normal page flow or only needs lightweight context beside a trigger.",
		accessibility:
			"Dialog traps focus, makes background content inert, closes on Escape, and restores focus. Every dialog still needs a Dialog.Title and useful description when context is not obvious.",
		related: ["popover", "command-search"],
	},
	"dropdown-menu": {
		runtime: "client",
		whenToUse:
			"DropdownMenu groups secondary actions that belong to one trigger and benefit from compact keyboard navigation.",
		whenToAvoid:
			"The choices are form values, primary navigation, or important enough to remain visible without opening a menu.",
		accessibility:
			"DropdownMenu supplies menu roles, roving focus, typeahead, Escape handling, and focus restoration. Item labels must describe actions rather than destinations ambiguously.",
		related: ["popover", "button"],
	},
	field: {
		runtime: "server",
		whenToUse:
			"Field keeps a label, control, supporting description, and validation message together as one form unit.",
		whenToAvoid:
			"The content is not a form control or the layout would hide a required label and error relationship.",
		accessibility:
			"Field preserves native child semantics. Connect Label with htmlFor, then wire Field.Description and Field.Error IDs through aria-describedby and expose invalid state on the control.",
		related: ["label", "input"],
	},
	label: {
		runtime: "client",
		whenToUse:
			"Label gives a form control a visible name and lets pointer users focus or activate that control from its text.",
		whenToAvoid:
			"The text is only a heading, helper copy, or a visual caption for content that is not a form control.",
		accessibility:
			"Set htmlFor to the associated control ID unless the control is nested. Keep the visible wording specific and do not rely on placeholder text as the label.",
		related: ["field", "input"],
	},
	popover: {
		runtime: "client",
		whenToUse:
			"Popover places contextual controls or supporting information beside a trigger without blocking the rest of the page.",
		whenToAvoid:
			"The task must be modal, the content is only a short text hint, or the information should remain visible in the document.",
		accessibility:
			"Popover manages outside dismissal, Escape, collision positioning, and focus return. Its trigger needs a clear accessible name and its content needs a logical focus order.",
		related: ["dialog", "tooltip"],
	},
	"radio-group": {
		runtime: "client",
		whenToUse:
			"RadioGroup presents a visible set of mutually exclusive choices where comparing options before selection is useful.",
		whenToAvoid:
			"People may select several options, or a long option list would be easier to scan in a compact Select.",
		accessibility:
			"RadioGroup provides radio roles and arrow-key navigation. Give the group an accessible label and use each item's label prop or an explicitly associated label.",
		related: ["field", "checkbox"],
	},
	separator: {
		runtime: "client",
		whenToUse:
			"Separator creates a quiet visual or semantic boundary between adjacent sections, items, or control groups.",
		whenToAvoid:
			"Spacing alone explains the grouping, or a heading and section boundary would communicate the structure more clearly.",
		accessibility:
			"Separator is decorative by default and stays out of the accessibility tree. Set decorative to false only when the divider carries structural meaning.",
		related: ["section-head", "data-list"],
	},
	textarea: {
		runtime: "server",
		whenToUse:
			"Textarea collects prose, notes, messages, or any value that reasonably needs more than one line.",
		whenToAvoid:
			"The value is short and predictable, needs rich-text editing, or should be chosen from predefined options.",
		accessibility:
			"Textarea keeps native semantics. Pair it with Label, expose invalid state with aria-invalid, and associate descriptions and errors through aria-describedby.",
		related: ["field", "input"],
	},
	tooltip: {
		runtime: "client",
		whenToUse:
			"Tooltip adds a short explanation to a focusable control when the interface cannot show that supporting context persistently.",
		whenToAvoid:
			"The text is essential, interactive, lengthy, or being used instead of a control's accessible name.",
		accessibility:
			"Tooltip opens for pointer and keyboard focus and closes on Escape. The trigger must remain focusable and understandable without relying on the tooltip alone.",
		related: ["popover", "button"],
	},
	"action-rail": {
		runtime: "server",
		whenToUse:
			"A compact row or column of related buttons and links fits ActionRail well.",
		whenToAvoid:
			"The controls form primary navigation or need the container to manage selection state.",
		accessibility:
			"ActionRail adds no control semantics of its own. Keep each child's native semantics, and label the group when the relationship between its controls is not obvious.",
		related: ["button", "navbar"],
	},
	avatar: {
		runtime: "server",
		whenToUse:
			"Avatar works well for a small person or account image that can fall back to initials or custom content.",
		whenToAvoid:
			"The media needs a caption, responsive art direction, or a shape other than a circle.",
		accessibility:
			"With src present, Avatar uses an img. Give an identifying portrait meaningful alt text; use an empty alt when it is decorative.",
		related: ["testimonial", "card"],
	},
	"back-link": {
		runtime: "server",
		whenToUse:
			"BackLink gives readers a short, stable route to a parent page or the previous content level.",
		whenToAvoid:
			"You need an in-place action or true browser-history behavior instead of a stable destination.",
		accessibility:
			"BackLink is an anchor by default, and its decorative line is hidden from assistive technology. Provide href and descriptive text, and preserve link semantics when overriding as.",
		related: ["button", "navbar"],
	},
	badge: {
		runtime: "server",
		whenToUse:
			"Badge is for short, static labels such as a category, version, or compact count.",
		whenToAvoid:
			"The label is selectable, changes live, or contains enough text to wrap.",
		accessibility:
			"Badge is a span with no announcement role. Its text must make sense on its own, and live changes need a separate status mechanism.",
		related: ["status", "tag"],
	},
	button: {
		runtime: "server",
		whenToUse:
			"Choose Button for a discrete action, an action link, an icon control, or a loading submission state.",
		whenToAvoid:
			"The control represents persistent on-off state, a radio-style choice, or an entire clickable card.",
		accessibility:
			"Button defaults to type button, exposes loading through aria-busy and aria-disabled, and requires an accessible name for icon-only use or any semantic element supplied through asChild.",
		related: ["action-rail", "toggle"],
	},
	callout: {
		runtime: "server",
		whenToUse:
			"Callout separates a note, tip, or warning from the surrounding documentation.",
		whenToAvoid:
			"The message is transient, reports a validation error, or belongs in the normal reading flow.",
		accessibility:
			"Callout uses an aside and a visible label, but it is not a live region. Handle urgent messages with an explicit alert strategy.",
		related: ["code-block", "section-head"],
	},
	card: {
		runtime: "server",
		whenToUse:
			"Card suits a content summary that stays static or acts as one link or button.",
		whenToAvoid: "A clickable card would contain several independent controls.",
		accessibility:
			"Card selects native anchor, button, or div semantics from href and onClick, defaults button cards to type button, and requires the chosen root to have a clear accessible name.",
		related: ["media-frame", "tag"],
	},
	changelog: {
		runtime: "server",
		whenToUse:
			"ChangelogTimeline turns grouped git-cliff releases into a timeline with commit, pull-request, and author links.",
		whenToAvoid:
			"The data is a general event timeline or does not match the GitCliffRelease shape.",
		accessibility:
			"The timeline uses h3 headings for releases, h4 headings for groups, and lists for commits. Place it below an h2 and keep generated link labels clear in context.",
		related: ["editorial-line", "toc"],
	},
	"code-block": {
		runtime: "client",
		whenToUse:
			"CodeBlock works for scrollable examples that need a filename or copy button.",
		whenToAvoid:
			"You need inline code, an executable editor, or for the component itself to produce syntax highlighting.",
		accessibility:
			"CodeBlock combines figure, pre, and code elements. Its scrolling region accepts keyboard focus, and copy buttons have text labels.",
		related: ["callout", "toc"],
	},
	"command-search": {
		runtime: "client",
		whenToUse:
			"CommandSearch suits a controlled, keyboard-driven search or command palette with filterable actions.",
		whenToAvoid:
			"Search should stay visible on the page or results exist only on the server with no client controller.",
		accessibility:
			"CommandSearch delegates command-list semantics to cmdk and closes on Escape, while the caller must provide an accessible opener and restore focus when the portal closes.",
		related: ["input", "resources-panel"],
	},
	container: {
		runtime: "server",
		whenToUse:
			"Container keeps a page or major section at a consistent responsive width.",
		whenToAvoid:
			"You are arranging a local flex or grid layout that does not need a maximum page width.",
		accessibility:
			"Container is a div by default and accepts as for landmarks such as main or section, so choose the semantic element that matches the enclosed content.",
		related: ["section-head", "navbar"],
	},
	"data-list": {
		runtime: "server",
		whenToUse:
			"DataList works for compact, consistently aligned facts, milestones, or metadata.",
		whenToAvoid:
			"The data needs column headers, or each row is navigation and should be an anchor.",
		accessibility:
			"DataList items become native buttons only when onClick is supplied. Static rows remain divs and should not receive focus unless you implement the expected keyboard behavior.",
		related: ["metric", "editorial-line"],
	},
	"editorial-line": {
		runtime: "server",
		whenToUse:
			"EditorialLine suits a dated article, release, or project summary in a dense index.",
		whenToAvoid:
			"A record lacks a meaningful title and date, or each row needs several actions.",
		accessibility:
			"With href present, the whole line is one anchor; otherwise it is an article. The supplied date uses a time element.",
		related: ["link-list", "meta-row"],
	},
	eyebrow: {
		runtime: "server",
		whenToUse:
			"Eyebrow adds a short category or context label beside a heading or content block.",
		whenToAvoid:
			"The text is the actual heading or needs more than a short contextual label.",
		accessibility:
			"Eyebrow is a span, not a heading. The associated section still needs a heading at the correct level.",
		related: ["section-head", "card"],
	},
	footer: {
		runtime: "server",
		whenToUse:
			"Footer combines site-wide copy, grouped resource links, an optional status, and a Server Action subscription form.",
		whenToAvoid:
			"The controls belong only to the current page, or a small legal footer is all the site needs.",
		accessibility:
			"Footer provides a footer landmark, labeled navigation groups, native links, and labeled form controls for email subscriptions.",
		related: ["link-list", "input"],
	},
	input: {
		runtime: "server",
		whenToUse:
			"Input covers a single native text field with optional prefix, suffix, sizing, and error styling.",
		whenToAvoid:
			"The field needs multiple lines, composite selection, or built-in validation messages.",
		accessibility:
			"Input wraps the native input in a label but provides no built-in label text, so supply an accessible name and describe errors with aria-invalid and aria-describedby when applicable.",
		related: ["select", "button"],
	},
	"link-list": {
		runtime: "server",
		whenToUse:
			"LinkList works for a titled collection of editorial resources with linked or static rows.",
		whenToAvoid:
			"The collection is an application menu, a set of selectable options, or tabular data.",
		accessibility:
			"LinkList uses anchors for linked items and articles for static ones. Give the section a contextual title and keep item titles descriptive.",
		related: ["editorial-line", "resources-panel"],
	},
	"media-frame": {
		runtime: "server",
		whenToUse:
			"MediaFrame reserves a stable ratio and styled boundary for an image, video, embed, or placeholder.",
		whenToAvoid:
			"The media must keep an unconstrained intrinsic ratio or needs figure semantics without a custom asChild root.",
		accessibility:
			"MediaFrame is a visual div wrapper, so the nested media must provide its own alt text, controls, title, caption association, and other required semantics.",
		related: ["card", "meta-row"],
	},
	"meta-row": {
		runtime: "server",
		whenToUse:
			"MetaRow keeps a byline, date, category, or reading time together on one responsive line.",
		whenToAvoid:
			"The content is key-value data that needs explicit term and description relationships.",
		accessibility:
			"MetaRow adds no semantics beyond a div and hides its separators. Each child must carry the appropriate link, time, or text semantics.",
		related: ["eyebrow", "editorial-line"],
	},
	metric: {
		runtime: "server",
		whenToUse:
			"Metric highlights one value with a compact label, optional trend, and short explanation.",
		whenToAvoid:
			"The value represents continuous progress, belongs in a dense table, or needs a chart to explain its trend.",
		accessibility:
			"Metric places its text in generic divs and shows trend with an arrow. Add spoken context when the direction has meaning.",
		related: ["progress", "data-list"],
	},
	navbar: {
		runtime: "server",
		whenToUse:
			"Navbar provides a responsive site header for a brand, primary links, and optional actions.",
		whenToAvoid:
			"Navigation belongs in an application sidebar, has nested levels, or needs built-in disclosure state.",
		accessibility:
			"Navbar provides header and nav landmarks, labels the navigation, and marks the active link with aria-current page.",
		related: ["command-search", "button"],
	},
	progress: {
		runtime: "client",
		whenToUse:
			"Progress covers known completion, indeterminate work, and document scroll position.",
		whenToAvoid:
			"People need discrete steps, an editable value, or a static status label instead.",
		accessibility:
			"Progress exposes role progressbar and normalized value attributes, and callers must provide an accessible label or labelledby relationship.",
		related: ["status", "skeleton"],
	},
	"pull-quote": {
		runtime: "server",
		whenToUse:
			"PullQuote draws attention to a genuine quotation and optional attribution inside long-form content.",
		whenToAvoid:
			"The copy is decorative rather than quoted, or the attribution needs a full testimonial card.",
		accessibility:
			"PullQuote uses figure, blockquote, and an optional figcaption, preserving native semantics for both quotation and attribution.",
		related: ["testimonial", "section-head"],
	},
	rail: {
		runtime: "server",
		whenToUse:
			"Rail works for a compact vertical list with an optional title, active marker, and item counts.",
		whenToAvoid:
			"It acts as navigation but its items are not real links or it lacks a surrounding navigation landmark.",
		accessibility:
			"Rail contains a ul and li elements inside a div. Its active dot is decorative, so text or link semantics must also communicate the active state.",
		related: ["link-list", "toc"],
	},
	"resources-panel": {
		runtime: "server",
		whenToUse:
			"ResourcesPanel groups source, package, documentation, design, or media links in one place.",
		whenToAvoid:
			"The links are primary site navigation or the URLs have no clear user-facing labels.",
		accessibility:
			"ResourcesPanel is an aside containing a list of native links. Decorative icons stay hidden, and the complementary landmark needs a descriptive title.",
		related: ["link-list", "code-block"],
	},
	"section-head": {
		runtime: "server",
		whenToUse:
			"SectionHead gives a page section a consistent eyebrow, title, subtitle, and introduction.",
		whenToAvoid:
			"The content does not introduce a section, or the document needs a heading below h3.",
		accessibility:
			"SectionHead chooses h1, h2, or h3 from level. Base that level on the document structure, not the desired visual size.",
		related: ["eyebrow", "container"],
	},
	"segmented-control": {
		runtime: "client",
		whenToUse:
			"SegmentedControl suits one choice from a small, stable set of options.",
		whenToAvoid:
			"The options are independent toggles, have long labels, or make more sense in a select.",
		accessibility:
			"SegmentedControl uses radiogroup and radio semantics with roving tab focus and arrow-key navigation, and the group still needs an accessible label.",
		related: ["toggle", "select"],
	},
	select: {
		runtime: "client",
		whenToUse:
			"Select fits a moderate option set and switches between a desktop popover and mobile sheet.",
		whenToAvoid:
			"You need unsynchronized native form submission, multiple selection, or interactive content inside an option.",
		accessibility:
			"Select wires its trigger to a listbox, exposes options with aria-selected, and implements keyboard navigation, typeahead, focus management, and labeled trigger text.",
		related: ["input", "segmented-control"],
	},
	skeleton: {
		runtime: "server",
		whenToUse:
			"Skeleton holds the final layout steady while content with known dimensions loads.",
		whenToAvoid:
			"The wait needs real progress information, or the placeholder cannot match the final content's dimensions.",
		accessibility:
			"Skeleton is always aria-hidden, so loading state and completion must be communicated by the surrounding region rather than the placeholder itself.",
		related: ["progress", "card"],
	},
	status: {
		runtime: "server",
		whenToUse:
			"Status shows a compact, persistent state such as availability, health, or lifecycle stage.",
		whenToAvoid:
			"The message is transient, the state is interactive, or color would be its only explanation.",
		accessibility:
			"Status is a text span with a decorative dot hidden from assistive technology. It is not a live region and will not announce changes automatically.",
		related: ["badge", "progress"],
	},
	tag: {
		runtime: "server",
		whenToUse:
			"Use Tag for one filter or a compact, non-interactive category label.",
		whenToAvoid:
			"The tag navigates, belongs to a mutually exclusive group, or changes a persistent setting.",
		accessibility:
			"An interactive Tag is a button with aria-pressed; a static Tag is a span. Any element supplied through asChild must preserve equivalent semantics.",
		related: ["badge", "segmented-control"],
	},
	testimonial: {
		runtime: "server",
		whenToUse:
			"Testimonial presents an attributed customer or collaborator quote with an optional portrait and role.",
		whenToAvoid:
			"The quote has no attribution or belongs directly in the surrounding article prose.",
		accessibility:
			"Testimonial uses figure, blockquote, and figcaption semantics. Its quotation mark is decorative, and an identifying portrait needs avatarAlt.",
		related: ["avatar", "pull-quote"],
	},
	"testimonial-grid": {
		runtime: "server",
		whenToUse:
			"TestimonialGrid arranges several testimonials in a responsive grid or masonry-style flow.",
		whenToAvoid:
			"The cards are unrelated, or their visual order must differ from DOM reading order.",
		accessibility:
			"TestimonialGrid is a layout-only div. Keep DOM order logical, and give each child the appropriate testimonial semantics.",
		related: ["testimonial", "card"],
	},
	"theme-switcher": {
		runtime: "client",
		whenToUse:
			"ThemeSwitcher handles a controlled light and dark choice as a compact button or full switch.",
		whenToAvoid:
			"The app offers more than two themes, or the caller cannot manage persistence and document updates.",
		accessibility:
			"ThemeSwitcher supplies a state-specific accessible label and uses a native button in mini mode or a labeled switch in full mode.",
		related: ["toggle", "button"],
	},
	toast: {
		runtime: "server",
		whenToUse:
			"Toast gives brief, non-blocking feedback and can accept a dismiss action from a client owner.",
		whenToAvoid:
			"The message asks for destructive confirmation, must stay on the page, or needs to interrupt immediately.",
		accessibility:
			"Toast uses role status and gives its dismiss button a text label. Urgent errors need alert semantics, and dismissal requires a client boundary.",
		related: ["status", "callout"],
	},
	toc: {
		runtime: "client",
		whenToUse:
			"Toc links to headings on the current page, tracks the active section, and can collapse on smaller screens.",
		whenToAvoid:
			"The links cross pages, or target headings do not have stable, unique ids.",
		accessibility:
			"Toc creates a nav with ordered fragment links. Its collapsible trigger currently lacks aria-expanded and aria-controls.",
		related: ["rail", "section-head"],
	},
	toggle: {
		runtime: "client",
		whenToUse:
			"Toggle handles one binary setting that takes effect immediately, whether its state is controlled or internal.",
		whenToAvoid:
			"The value is submitted with a form, belongs to a mutually exclusive group, or is an action rather than persistent state.",
		accessibility:
			"Toggle uses a button with role switch and aria-checked. Its accessible label should describe the setting, not the action that will happen next.",
		related: ["segmented-control", "theme-switcher"],
	},
} as const satisfies Record<ComponentSlug, ComponentGuidance>
