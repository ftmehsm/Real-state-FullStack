import connectDB from "@/utils/connectDB";
import { Ad } from "@/models/Ad";
import { Types } from "mongoose";

export async function getMyAds(userId: string) {
  await connectDB();

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("شناسه کاربر نامعتبر است.");
  }

  const ads = await Ad.find({
    userId,
  })
    .sort({ createdAt: -1 })
    .lean();

  return ads.map((ad) => ({
    ...ad,
    _id: ad._id.toString(),
    userId: ad.userId.toString(),
    createdAt: ad.createdAt.toISOString(),
    updatedAt: ad.updatedAt.toISOString(),
  }));
}

export async function deleteAd(adId: string, userId: string) {
  await connectDB();

  if (!Types.ObjectId.isValid(adId)) {
    throw new Error("شناسه آگهی نامعتبر است.");
  }

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("شناسه کاربر نامعتبر است.");
  }

  const deletedAd = await Ad.findOneAndDelete({
    _id: adId,
    userId,
  });

  if (!deletedAd) {
    throw new Error("آگهی پیدا نشد یا متعلق به این کاربر نیست.");
  }

  return {
    success: true,
  };
}

export async function getAdById(adId: string) {
  await connectDB();

  if (!Types.ObjectId.isValid(adId)) {
    throw new Error("شناسه آگهی نامعتبر است.");
  }

  const ad = await Ad.findById(adId).lean();

  if (!ad) {
    throw new Error("آگهی پیدا نشد.");
  }

  return {
    ...ad,
    _id: ad._id.toString(),
    userId: ad.userId.toString(),

    images: ad.images?.map((image: any) => ({
      ...image,
      _id: image._id?.toString(),
    })),

    createdAt: ad.createdAt.toISOString(),
    updatedAt: ad.updatedAt.toISOString(),
  };
}
export async function updateAd(adId: string, userId: string, data: any) {
  await connectDB();

  if (!Types.ObjectId.isValid(adId)) {
    throw new Error("شناسه آگهی نامعتبر است.");
  }

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("شناسه کاربر نامعتبر است.");
  }

  const updatedAd = await Ad.findOneAndUpdate(
    {
      _id: adId,
      userId,
    },
    data,
    {
      new: true,
      runValidators: true,
    },
  ).lean();

  if (!updatedAd) {
    throw new Error("آگهی پیدا نشد یا متعلق به این کاربر نیست.");
  }

  return {
    ...updatedAd,
    _id: updatedAd._id.toString(),
    userId: updatedAd.userId.toString(),
    createdAt: updatedAd.createdAt.toISOString(),
    updatedAt: updatedAd.updatedAt.toISOString(),
  };
}
