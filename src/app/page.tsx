import Link from "next/link";
import { FiLink } from "react-icons/fi";
import Header from "@/components/shared/Header";
import CodeBlock from "@/components/shared/CodeBlock";
import CreateTokenForm from "@/components/shared/CreateTokenForm";

let sampleTemplate = `{
  "name": "SolCraft.io",
  "symbol": "SoC",
  "description": "Small description of your token.",
  "image": "paste_arweave_image_link_here"
}`

export default function Home() {
  return (
    <div className="h-screen">
      <Header />
      <main className="wrapper">
        <div className="flex flex-col gap-5 mt-5">
          <h2 className="text-center h3-bold">Solana Token Creator</h2>
          <Link href="/" className="flex items-center gap-2 text-gray-200 p-medium-18">
            <FiLink />
            Click here to access the metadata guide for adding links on Solcscan
          </Link>
          <CodeBlock code={sampleTemplate} title="Sample Metadata:" />
        </div>
        <div className="flex flex-col gap-5 mt-10">
          <h2 className="text-center h3-bold">Create Solana Token</h2>
          <CreateTokenForm />
        </div>
      </main>
    </div>
  );
}
