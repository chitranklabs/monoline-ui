---
title: Architecture
description: Understand the widget, headless state, transport, and presentation boundaries.
order: 6
---

## Component layer

`ChatWidget` renders the launcher, panel, message list, and input. It delegates
conversation behavior to the headless hooks.

## State and transport

- `useChat` coordinates messages and streaming state.
- `useSSEStream` converts an SSE response into tokens.
- `useSession` persists history in browser storage.

## Styles

Cascade layers and scoped variables keep styles inside the widget.
