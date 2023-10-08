import { getServerSession } from "next-auth";
import { authOptions } from "../api/_utils/auth-options";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return <>{session?.user?.email}</>;
}
