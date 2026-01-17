'use client';

import copy from 'copy-to-clipboard';
import { useCallback, useEffect, useRef, useState } from 'react';

type UseCopyClipboardOptions = {
   resetMs?: number;
};

type UseCopyClipboardResult = {
   copied: boolean;
   error: string | null;
   copyText: (text: string) => boolean;
   reset: () => void;
};

const DEFAULT_RESET_MS = 1500;

export function useCopyClipboard(options: UseCopyClipboardOptions = {}): UseCopyClipboardResult {
   const { resetMs = DEFAULT_RESET_MS } = options;
   const [copied, setCopied] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const timeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

   const reset = useCallback(() => {
      setCopied(false);
      setError(null);
      if (timeoutRef.current) {
         window.clearTimeout(timeoutRef.current);
         timeoutRef.current = null;
      }
   }, []);

   useEffect(() => {
      return () => {
         if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
         }
      };
   }, []);

   const copyText = useCallback(
      (text: string) => {
         if (!text) {
            setError('Nothing to copy.');
            setCopied(false);
            return false;
         }

         try {
            const didCopy = copy(text);
            if (!didCopy) {
               throw new Error('Copy failed.');
            }

            setCopied(true);
            setError(null);

            if (resetMs > 0) {
               if (timeoutRef.current) {
                  window.clearTimeout(timeoutRef.current);
               }
               timeoutRef.current = window.setTimeout(() => {
                  setCopied(false);
               }, resetMs);
            }

            return true;
         } catch (err) {
            setCopied(false);
            setError(err instanceof Error ? err.message : 'Copy failed.');
            return false;
         }
      },
      [resetMs]
   );

   return { copied, error, copyText, reset };
}
