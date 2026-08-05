import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import { hashPassword, verifyPassword } from "@/utils/auth";


type SignupParams = {
  name: string;
  email: string;
  password: string;
};

type loginParams = {
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

export async function login({email,password}: loginParams){
  await connectDB();


  if(!email || !password){
    throw new Error("ایمیل و رمز عبور الزامیست");
  }

  const user = await User.findOne({ email });

  if(!user){
    throw new Error("کاربری با این ایمیل یافت نشد. لطفا ابتدا ثبت نام کنید");

  }

  const verifiedPass = verifyPassword(password,user.password)

  if(!verifiedPass){
    throw new Error("ایمیل یا رمز عبور اشتباه است");
  }

  return user;
}