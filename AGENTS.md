# Agent Instructions for solana-dapp-test

## Mission
- Build a professional Solana dApp that integrates the local Anchor program to create SPL tokens, mint more tokens, revoke/transfer authorities, and allow users to mint limited free tokens.
- Use Solana Kit + Next.js App Router + shadcn/ui + Tailwind v4 with a dark-theme-first design.

## Tech Stack & Libraries
- Framework: Next.js (App Router, RSC-enabled).
- UI: shadcn/ui (New York style), lucide icons, Tailwind v4 with CSS variables.
- Solana: Solana Kit for wallet + RPC, Anchor program integration via IDL.

## Design Requirements
- Dark theme is the default and primary UX.
- Use shadcn/ui components from `components/ui` and shared components in `app/components`.
- Avoid generic layouts; keep hierarchy, spacing, and typography intentional.
- Reuse Tailwind v4 tokens and CSS variables; do not inline colors when a token exists.

## Project Conventions
- File structure:
  - App Router pages in `app/`.
  - Shared UI components in `app/components/`.
  - shadcn/ui primitives in `components/ui/`.
  - Utilities in `lib/`.
  - Solana/Anchor integration code should live in `lib/solana/` (create if missing).
- Prefer TypeScript, functional components, and server components by default unless a client boundary is required.
- Use `"use client"` only when needed for wallet state, interactions, or hooks.
- Keep modules small and focused; extract reusable logic into `lib/`.

## Solana + Anchor Integration
- Anchor program lives under `anchor/`; use its IDL and program ID as the source of truth.
- Avoid hardcoding RPC endpoints; use environment configuration where possible.
- Token operations to support:
  - Create new mint (token creation).
  - Mint additional supply.
  - Revoke or transfer mint/freeze authorities.
  - User-initiated "free mint" flow with clear limits/guards.
- Provide clear status and error handling for all on-chain actions.

## Tailwind v4 Guidance
- Prefer class-based styling with Tailwind utilities.
- Define or reuse CSS variables in `app/globals.css` when styling needs shared tokens.
- Ensure responsive layouts and proper mobile behavior.

## Development Workflow
- Before major changes, scan for existing patterns in `app/` and `lib/`.
- Keep changes consistent with `components.json` aliases:
  - `@/components`, `@/components/ui`, `@/lib`.
- If adding new dependencies, update `package.json` and `package-lock.json`.

## Testing/Verification
- If tests or scripts are added later, document how to run them in relevant PR notes.
- Prefer lightweight manual checks: page renders, wallet connect, and transaction flows.
