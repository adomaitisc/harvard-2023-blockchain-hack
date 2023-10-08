import { getServerSession } from "next-auth";
import { authOptions } from "../api/_utils/auth-options";
import { Header } from "./header";
import { CreateTrips } from "./create-trip";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/");
  return (
    <div className="w-full max-w-3xl mx-auto h-screen flex flex-col items-center justify-between">
      <Header session={session} />
      <CreateTrips />
    </div>
  );
}
