import connectDB from "@/utils/connectDB";
import { Ad } from "@/models/Ad";
import { Ad as AdTypes } from "@/types/types";

export async function createAd(adData: AdTypes) {
  try {
    await connectDB();

    const newAd = await Ad.create(adData);

    return {
      ...newAd.toObject(),
      _id: newAd._id.toString(),
    };
  } catch (error) {
    throw new Error("خطایی در سرور پیش آمده");
  }
}
