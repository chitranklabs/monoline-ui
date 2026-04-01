;(() => {
	const c = document.cookie.match(/(?:^|; )monoline-accent=([^;]*)/)
	if (c) document.documentElement.dataset.accent = c[1]
})()
