import Image from "next/image";
import { ConnectWallet } from "./connect-walllet";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-200">
      <div className="w-full max-w-3xl mx-auto h-screen bg-red-400/20">
        {/* Header */}
        <ConnectWallet />
      </div>
    </main>
  );
}
