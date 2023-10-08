import Image from "next/image";
import { ConnectWallet } from "./connect-walllet";
import { authOptions } from "./api/_utils/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) return redirect("/home");

  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="w-full max-w-3xl mx-auto h-screen flex flex-col items-center justify-end">
        <h1> I am home page</h1>
        <ConnectWallet />
      </div>
    </main>
  );
}
