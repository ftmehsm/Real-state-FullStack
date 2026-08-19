import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import { Ad } from "@/models/Ad";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Types } from "mongoose";

type AdImage = {
  url: string;
  key: string;
};

type CreateAdData = {
  name: string;
  description: string;
  address: string;
  phone: string;
  agency: string;
  category: string;

  transactionType: "buy" | "rent";

  price?: number;
  deposit?: number;
  rent?: number;

  area: number;

  amenities: string[];
  rules: string[];

  constructionDate: string;

  images: AdImage[];
};

export async function createAd(data: CreateAdData) {
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
    images,
  } = data;

  // -------------------------
  // Session
  // -------------------------

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error(
      "به حساب کاربری خود وارد شوید",
    );
  }

  // -------------------------
  // User
  // -------------------------

  const user = await User.findOne({
    email: session.user.email,
  });

  if (!user) {
    throw new Error(
      "حساب کاربری مورد نظر یافت نشد",
    );
  }

  // -------------------------
  // Ad
  // -------------------------

  const adData = {
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
    images,

    ...(transactionType === "buy"
      ? {
          price,
        }
      : {
          deposit,
          rent,
        }),

    userId: new Types.ObjectId(user._id),
  };

  const newAd = await Ad.create(adData);

  return {
    id: newAd._id.toString(),
    name: newAd.name,
    description: newAd.description,
    address: newAd.address,
    phone: newAd.phone,
    agency: newAd.agency,
    category: newAd.category,
    transactionType: newAd.transactionType,
    price: newAd.price,
    deposit: newAd.deposit,
    rent: newAd.rent,
    area: newAd.area,
    amenities: newAd.amenities,
    rules: newAd.rules,
    constructionDate: newAd.constructionDate,
    images: newAd.images.map(
      (image: {
        url: string;
        key: string;
      }) => ({
        url: image.url,
        key: image.key,
      }),
    ),
    userId: newAd.userId.toString(),
  };
}