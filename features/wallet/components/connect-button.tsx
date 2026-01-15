"use client";

import { useState } from "react";
import {
  useConnectWallet,
  useDisconnectWallet,
  useWallet,
  useWalletConnection,
} from "@solana/react-hooks";
import { ChevronDown, ChevronUp, LogOut, Sparkles, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function truncate(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function ConnectButton() {
  const wallet = useWallet();
  const { connectors } = useWalletConnection();
  const connectWallet = useConnectWallet();
  const disconnectWallet = useDisconnectWallet();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const isConnected = wallet.status === "connected";
  const address = isConnected
    ? wallet.session.account.address.toString()
    : null;

  async function handleConnect(connectorId: string) {
    setError(null);
    try {
      await connectWallet(connectorId, { autoConnect: true });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to connect");
    }
  }

  async function handleDisconnect() {
    setError(null);
    try {
      await disconnectWallet();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to disconnect");
    }
  }

  const menuId = "wallet-menu";
  const connectionLabel = address ? truncate(address) : "Connect wallet";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-expanded={open}
          aria-controls={menuId}
          className={cn(
            "group relative h-14 w-full max-w-sm justify-between overflow-hidden rounded-2xl border-border/60 bg-card/50 px-4 text-left shadow-sm transition hover:border-border/80 hover:bg-card/80",
            isConnected ? "ring-1 ring-primary/30" : "ring-1 ring-border/50"
          )}
        >
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          <span className="relative flex items-center gap-3">
            <span
              className={cn(
                "flex size-10 items-center justify-center rounded-xl border border-border/50 bg-background/70 text-muted-foreground transition group-hover:border-border/80",
                isConnected && "text-primary"
              )}
            >
              <Wallet className="size-4" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {connectionLabel}
              </span>
              <span className="text-xs text-muted-foreground">
                {isConnected ? "Wallet connected" : "Solana Devnet"}
              </span>
            </span>
          </span>
          <span className="relative flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            {isConnected ? "Manage" : "Select"}
            {open ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        id={menuId}
        align="start"
        sideOffset={12}
        className="w-[var(--radix-popper-anchor-width)] min-w-[260px] max-w-[calc(100vw-2rem)] border-border/60 bg-popover/95 p-0 shadow-xl backdrop-blur"
      >
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="size-4 text-primary" />
                Wallet Access
              </CardTitle>
              {isConnected ? (
                <Badge variant="secondary" className="gap-1">
                  <span className="size-1.5 rounded-full bg-primary" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline">Not connected</Badge>
              )}
            </div>
            <CardDescription className="text-xs">
              {isConnected
                ? "Manage your wallet connection and keep mint access active."
                : "Choose a wallet to connect and start minting SPL tokens."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isConnected ? (
              <div className="space-y-3">
                <div className="rounded-xl border border-border/50 bg-muted/30 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Active address
                  </p>
                  <p className="mt-1 font-mono text-sm text-foreground">
                    {address ? truncate(address) : ""}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void handleDisconnect()}
                  className="w-full justify-between rounded-xl"
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="size-4" />
                    Disconnect
                  </span>
                  <span className="text-xs text-muted-foreground">
                    End session
                  </span>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {connectors.length ? (
                  connectors.map((connector) => (
                    <Button
                      key={connector.id}
                      type="button"
                      variant="ghost"
                      onClick={() => void handleConnect(connector.id)}
                      className="h-11 w-full justify-between rounded-xl border border-border/50 bg-background/60 px-3 hover:bg-accent/30"
                    >
                      <span className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-lg border border-border/50 bg-muted text-xs font-semibold uppercase text-muted-foreground">
                          {connector.name.slice(0, 1)}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {connector.name}
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Connect
                      </span>
                    </Button>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                    No wallets detected. Install a wallet extension to continue.
                  </div>
                )}
              </div>
            )}
            {error ? (
              <p className="text-xs font-semibold text-destructive">{error}</p>
            ) : null}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
