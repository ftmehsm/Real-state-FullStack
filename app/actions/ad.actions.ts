"use server";

import { deleteAd } from "@/lib/services/ad.services";
import getCurrentUser from "@/utils/getCurrentUser";
import { revalidatePath } from "next/cache";

export async function deleteAdAction(formData: FormData) {
  const id = formData.get("id");
  const user = await getCurrentUser()

  if (typeof id !== "string" || !id) {
    throw new Error("شناسه آگهی نامعتبر است.");
  }

  try {
    await deleteAd(id , user._id);

    revalidatePath("/profile/ads");
  } catch {
    throw new Error("حذف آگهی انجام نشد.");
  }
}