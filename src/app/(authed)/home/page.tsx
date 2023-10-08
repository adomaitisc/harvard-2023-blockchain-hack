import { getServerSession } from "next-auth";
import { authOptions } from "../../api/_utils/auth-options";
import { CreateTrips } from "./create-trip";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/");
  return <CreateTrips />;
}
