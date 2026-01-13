"use client";
import { useWalletConnection } from "@solana/react-hooks";
import { ConnectButton } from "./components/connect-button";

export default function Home() {
  const { connectors, connect, disconnect, wallet, status } =
    useWalletConnection();

  const address = wallet?.account.address.toString();

  return (
    <div className="">
      <main>
        <ConnectButton />
      </main>
    </div>
  );
}
