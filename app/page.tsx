"use client";

import { Button } from "@/components/ui/button";
import { ConnectButton } from "@/features/wallet";
import { useFactoryClient } from "@/features/factory";
import { useTokenClient } from "@/features/token";

export default function Home() {
  const { createToken } = useTokenClient();
  const { factoryConfig, initializeFactory } = useFactoryClient();

  return (
    <div className="">
      <main>
        <ConnectButton />
        <pre>{JSON.stringify(factoryConfig.data?.exists, null, 2)}</pre>
        <Button onClick={() => initializeFactory.mutateAsync()}>
          Initialize Factory
        </Button>

        <Button onClick={() => createToken.mutateAsync()}>Create Token</Button>
      </main>
    </div>
  );
}
