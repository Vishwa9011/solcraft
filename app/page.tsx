"use client";

import { Button } from "@/components/ui/button";
import { ConnectButton } from "@/features/wallet";
import { useFactoryClient } from "@/features/factory";
import { useTokenActions } from "@/features/token";
import { Address } from "@solana/kit";

export default function Home() {
  const { createToken, mintTokens } = useTokenActions();
  const { factoryConfig, initialize } = useFactoryClient();

  return (
    <div className="">
      <main>
        <ConnectButton />
        <pre>{JSON.stringify(factoryConfig.data?.exists, null, 2)}</pre>
        <Button onClick={() => initialize.mutateAsync()}>
          Initialize Factory
        </Button>

        <Button
          onClick={() =>
            createToken.mutateAsync({
              name: "My Token",
              symbol: "MTK",
              supply: 1000000 * 1e6,
              decimals: 6,
              uri: "https://example.com/my-token-metadata.json",
            })
          }
        >
          Create Token
        </Button>
        <Button
          onClick={() =>
            mintTokens.mutateAsync({
              amount: 1000 * 1e6,
              mint: "7pEE6mXjDcBgNjWCGSvnqWjD9iDDzQYSgzGz1hBCLyiH" as Address<string>,
            })
          }
        >
          Mint Token
        </Button>
      </main>
    </div>
  );
}
