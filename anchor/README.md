# Solcraft Anchor Workspace

This workspace contains the on-chain Solcraft program that powers the factory, token, and faucet flows used by the Next.js app.

## Program Overview

Core instructions:

- Factory: initialize, update creation fee, pause/unpause, withdraw fees.
- Token: create token, mint tokens, transfer mint authority.
- Faucet: initialize, deposit, withdraw, claim.

Accounts:

- `FactoryConfig`: admin, fee config, treasury, pause state.
- `FaucetConfig`: owner, mint, treasury ATA, claim limits, cooldowns.
- `FaucetRecipientData`: last-claim timestamp per wallet.

## Prerequisites

- Rust toolchain
- Solana CLI
- Anchor CLI

Recommended:

- `solana config set --url devnet` or `localnet` for local testing.
- A funded keypair at `~/.config/solana/id.json` (default in `Anchor.toml`).

## Build

```bash
cd anchor
anchor build
```

## Test (Local Validator)

If you need Metaplex on localnet, start a validator with the token metadata program cloned from mainnet:

```bash
solana-test-validator --reset \
  --clone-upgradeable-program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s \
  --url https://api.mainnet-beta.solana.com
```

Keep this running in a separate terminal while you test locally.

```bash
cd anchor
anchor test --skip-deploy
```

The test validator configuration lives in `anchor/Anchor.toml`.

## Deploy

1. Make sure your program ID matches:
   - `anchor/programs/solcraft/src/lib.rs` (`declare_id!`)
   - `anchor/Anchor.toml` under `[programs.<cluster>]`
2. Build and deploy:
   ```bash
   cd anchor
   anchor build
   solana airdrop 2 --url devnet
   anchor deploy --provider.cluster devnet
   ```

## Regenerate the TypeScript Client

From the repo root, regenerate the Codama client after program changes:

```bash
npm run codama:js
```

Or run the combined workflow:

```bash
npm run setup
```
