# Solcraft

## Project Description

Solcraft is a production-ready SPL token operations suite that combines a token builder, faucet tooling, and admin controls with an on-chain Anchor program and a type-safe client.

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript
- Styling: Tailwind CSS v4, Radix UI
- Solana: @solana/kit, @solana/react-hooks
- On-chain: Anchor (Rust)
- Tooling: Codama, ESLint, Prettier

## Highlights

- Token Builder: create SPL tokens with metadata, supply, and authority controls.
- Metadata pipeline: upload token images to Cloudinary and pin metadata to IPFS via Pinata.
- Faucet Desk: configure claim limits, cooldowns, deposits, and withdrawals.
- Admin Console: initialize the factory, manage fees, pause or resume operations, and withdraw treasury funds.
- Wallet-ready: built on `@solana/react-hooks` with an RPC client from `@solana/kit`.

## Quick Start (Local)

Prerequisites:
- Node.js 18+
- npm
- A Solana wallet (Phantom or Backpack) set to devnet

Steps:
1. Copy the env file and fill in your credentials:
   ```bash
   cp .example.env .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` (redirects to `/overview`) and connect your wallet.

## Environment Variables

Solcraft validates env vars at runtime. The token builder requires Cloudinary and Pinata credentials.

| Name | Purpose |
| --- | --- |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name for image uploads |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `PINATA_API_KEY` | Pinata API key for metadata pinning |
| `PINATA_API_SECRET` | Pinata API secret |
| `PINATA_JWT_TOKEN` | Pinata JWT for uploads |
| `NEXT_PUBLIC_PINATA_GATEWAY_URL` | Gateway base URL for fetching pinned metadata |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Build the production bundle |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format files with Prettier |
| `npm run format:check` | Check formatting |
| `npm run anchor-build` | Build the Anchor program |
| `npm run anchor-test` | Run Anchor tests (skip deploy) |
| `npm run codama:js` | Regenerate the client from the IDL |
| `npm run setup` | Build Anchor and regenerate the client |

## Project Structure

```
app/                Next.js app routes and layouts
features/           Feature modules (token, faucet, factory)
generated/          Codama-generated Solana client
anchor/             Anchor workspace for on-chain programs
lib/                Shared utilities and env validation
public/             Static assets
```

## Program and Client

- The Anchor workspace lives in `anchor/`.
- Client code is generated in `generated/` using Codama.
- After changing on-chain programs, run:
  ```bash
  npm run setup
  ```

## Deployment Notes

If you deploy to Vercel, ensure build artifacts are excluded from uploads. A `.vercelignore` file is included to skip `anchor/target`.
