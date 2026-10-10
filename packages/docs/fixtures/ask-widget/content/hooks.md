---
title: Standalone hooks
description: Build a custom chat interface with Ask Widget's headless state and streaming hooks.
order: 5
---

## useChat

`useChat` owns messages, input, loading state, and the streaming lifecycle.

```tsx
const { messages, inputValue, setInputValue, sendMessage } = useChat({
	initialMessage: "How can I help?",
	streamResponse,
})
```

## useSSEStream

`useSSEStream` creates a response handler for an SSE endpoint.

## useSession

`useSession` persists and clears chat history with a product-specific storage key.
