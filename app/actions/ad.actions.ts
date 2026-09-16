"use server";

import { deleteAd, updateAd } from "@/lib/services/ad.services";
import getCurrentUser from "@/utils/getCurrentUser";
import { revalidatePath } from "next/cache";

import { validateAdForm } from "@/lib/validation/ad-validation";

import type { AdActionState } from "@/types/types";

export async function deleteAdAction(formData: FormData) {
  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    throw new Error("شناسه آگهی نامعتبر است.");
  }

  const user = await getCurrentUser();

  if (!user?._id) {
    throw new Error("کاربر وارد نشده است.");
  }

  try {
    await deleteAd(id, user._id);

    revalidatePath("/profile/ads");
  } catch (error) {
    console.error("deleteAdAction error:", error);

    throw new Error(
      error instanceof Error
        ? error.message
        : "حذف آگهی انجام نشد.",
    );
  }
}

export async function updateAdAction(
  adId: string,
  _prevState: AdActionState,
  formData: FormData,
): Promise<AdActionState> {
  const user = await getCurrentUser();

  if (!user?._id) {
    return {
      success: false,
      message: "کاربر وارد نشده است.",
      errors: {},
    };
  }

  if (!adId) {
    return {
      success: false,
      message: "شناسه آگهی نامعتبر است.",
      errors: {},
    };
  }

  const validation = validateAdForm(formData);

  if (!validation.success) {
    return {
      success: false,
      message: validation.message,
      errors: validation.errors,
    };
  }

  try {
    const updatedAd = await updateAd(
      adId,
      user._id,
      validation.data,
    );

    revalidatePath("/profile/ads");

    return {
      success: true,
      data: updatedAd,
      message: "آگهی با موفقیت ویرایش شد.",
      errors: {},
    };
  } catch (error) {
    console.error("updateAdAction error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "خطایی در ویرایش آگهی رخ داد.",
      errors: {},
    };
  }
}