import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/_utils/auth-options";
import { Header } from "./header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/");
  return (
    <div className="w-full max-w-3xl mx-auto h-screen flex flex-col items-center relative">
      <Header session={session} />
      {children}
    </div>
  );
}
