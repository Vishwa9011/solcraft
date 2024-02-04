"use client";

import { Button } from "../ui/button";
import { FaClipboard, FaCopy } from "react-icons/fa6";
import { IoCloudDoneSharp } from "react-icons/io5";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { IoClipboardOutline } from "react-icons/io5";
import { LuClipboard } from "react-icons/lu";
import { FaClipboardCheck } from "react-icons/fa";
interface CodeBlockProps {
  code: string;
  title?: string;
}

const CodeBlock = ({ code, title }: CodeBlockProps) => {
  const { isCopied, onCopy } = useCopyToClipboard();

  return (
    <div className="relative flex flex-col p-4 bg-gray-600 rounded-lg">
      <Button onClick={onCopy(code)} className="absolute flex items-center gap-2 p-1 px-2 ml-auto bg-gray-800 rounded-md h-7 right-5 p-semibold-14">
        {isCopied ? <FaClipboardCheck className="text-green-500" /> : <LuClipboard className="text-gray-200" />}
        {isCopied ? "Copied" : "Copy"}
      </Button>
      {title && <code className="mb-2 underline uppercase pointer-events-none select-none p-bold-18">{title}</code>}
      <pre>
        {code}
      </pre>
    </div>
  );
}

export default CodeBlock;