import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import InfoCards from "@/components/dashboard/InfoCards";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const user = await User.findOne({ email: session?.user?.email });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">داشبورد</h1>

        <p className="mt-2 text-muted-foreground">
          {session?.user?.name}، خوش آمدید.
        </p>
      </div>

      <InfoCards user={user} />
    </div>
  );
}
