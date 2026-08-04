import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import { hashPassword } from "@/utils/auth";


type SignupParams = {
  name: string;
  email: string;
  password: string;
};


export async function signup({
  name,
  email,
  password,
}: SignupParams) {

  await connectDB();


  const existingUser = await User.findOne({ email });


  if (existingUser) {
    throw new Error("این ایمیل قبلاً ثبت شده است.");
  }


  const hashedPassword = await hashPassword(password);


  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });


  return user;
}