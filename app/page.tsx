"use client";

import { Button } from "@/components/ui/button";
import { ConnectButton } from "../components/shared/connect-button";
import { useFactoryClient } from "@/features/factory/hooks/use-factory-client";

export default function Home() {
  const { factoryConfig, initializeFactory } = useFactoryClient();

  return (
    <div className="">
      <main>
        <ConnectButton />
        <Button onClick={() => initializeFactory.mutateAsync()}>
          Initialize Factory
        </Button>
      </main>
    </div>
  );
}
