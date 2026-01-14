"use client";

import { Button } from "@/components/ui/button";
import { ConnectButton } from "../components/shared/connect-button";
import { useFactoryClient } from "@/features/factory/hooks/use-factory-client";
import { useTokenClient } from "@/features/token/hooks/use-token-client";

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
