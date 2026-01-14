import { useSendTransaction } from "@solana/react-hooks";
import { useMutation } from "@tanstack/react-query";

export function useTokenClient() {
  const {} = useSendTransaction();

  const createToken = useMutation({
    mutationFn: async () => {},
  });
}
