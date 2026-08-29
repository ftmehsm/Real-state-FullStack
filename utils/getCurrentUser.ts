import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import { getServerSession } from "next-auth";

export default async function getCurrentUser(){
    const session = await getServerSession(authOptions);

    const user = await User.findOne({ email: session?.user?.email });

    return user
}