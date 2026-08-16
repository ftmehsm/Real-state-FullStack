import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import { Ad } from "@/models/Ad";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Types } from "mongoose";

export async function createAd(data: any) {
  try {
    await connectDB();

    const {
      name,
      description,
      address,
      phone,
      agency,
      category,
      transactionType,
      price,
      deposit,
      rent,
      area,
      amenities,
      rules,
      constructionDate,
    } = data;

    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("به حساب کاربری خود وارد شوید");
    }

    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
      throw new Error("حساب کاربری مورد نظر یافت نشد");
    }

    const newAd = await Ad.create({
      name,
      description,
      address,
      phone,
      agency,
      category,
      transactionType,
      area,
      amenities,
      rules,
      constructionDate,

      ...(transactionType === "buy"
        ? {
            price,
          }
        : {
            deposit,
            rent,
          }),

      userId: new Types.ObjectId(user._id),
    });

    return JSON.parse(JSON.stringify(newAd.toObject()));
  } catch (error) {
    console.log(error);
    throw new Error("خطایی در سرور پیش آمده است");
  }
}
