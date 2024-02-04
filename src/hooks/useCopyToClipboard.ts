"use client";

import copy from "copy-to-clipboard"
import { useCallback, useEffect, useState } from "react";

const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = useCallback((text: string) => {
    return () => {
      const didCopy = copy(text)
      setIsCopied(didCopy);
    }
  }, [copy])

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCopied) {
      interval = setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    }
    return () => {
      interval && clearTimeout(interval);
    };
  }, [isCopied, onCopy])

  return { isCopied, onCopy }
}

export default useCopyToClipboard;