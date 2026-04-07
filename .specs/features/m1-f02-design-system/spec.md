# M1-F02 - Design system & layout

## Goal

Establish the shared visual foundation for the MVP with a reusable app shell, light/dark theme switching, responsive page structure, and typography tokens that future form steps can reuse.

## Requirements

- `DS-001` The app must provide a shared shell with persistent navigation and footer across the current routes.
- `DS-002` Users must be able to switch between light and dark themes without hydration issues.
- `DS-003` The landing page and `/criar` route must use responsive layouts that work on mobile and desktop.
- `DS-004` The styling layer must expose reusable typography tokens for display, title, lead, body, and caption text.
- `DS-005` The `/criar` route must present a stable shell for the upcoming multi-step form and live preview work.

## Verification

- Header, footer, and navigation render consistently on `/` and `/criar`.
- Theme toggle updates the UI between light and dark modes cleanly.
- Main content reflows from stacked mobile layout to wider desktop layout.
- Typography utilities are used by the main route content instead of ad-hoc heading sizing everywhere.
