import { getServerSession } from "next-auth";
import { authOptions } from "../../api/_utils/auth-options";
import { redirect } from "next/navigation";

export default async function NearTrips() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/");
}
