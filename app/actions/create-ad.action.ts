"use server";

import { createAd } from "@/lib/services/create-ad.services";
import { validateAdForm } from "@/lib/validation/ad-validation";

import type { AdActionState } from "@/types/types";

export async function createAdAction(
  _prevState: AdActionState,
  formData: FormData,
): Promise<AdActionState> {
  const validation = validateAdForm(formData);

  if (!validation.success) {
    return {
      success: false,
      message: validation.message,
      errors: validation.errors,
    };
  }

  try {
    const createdAd = await createAd(
      validation.data,
    );

    return {
      success: true,
      data: createdAd,
      message: "آگهی با موفقیت ایجاد شد.",
      errors: {},
    };
  } catch (error) {
    console.error(
      "createAdAction error:",
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "خطایی در ایجاد آگهی رخ داد.",
      errors: {},
    };
  }
}