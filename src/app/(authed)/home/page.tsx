import { getServerSession } from "next-auth";
import { authOptions } from "../../api/_utils/auth-options";
import { CreateTrips } from "./create-trip";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/");
  return (
    <>
      <Link
        href="/trips"
        className="mb-4 px-3 py-2 bg-violet-600 rounded-lg shadow-md text-white text-sm hover:bg-violet-500 duration-200"
      >
        View your Commutes
      </Link>
      <CreateTrips />
    </>
  );
}
