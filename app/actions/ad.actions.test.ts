import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  deleteAdAction,
  updateAdAction,
} from "@/app/actions/ad.actions";

import { deleteAd, updateAd } from "@/lib/services/ad.services";
import getCurrentUser from "@/utils/getCurrentUser";
import { validateAdForm } from "@/lib/validation/ad-validation";
import { revalidatePath } from "next/cache";

vi.mock("@/lib/services/ad.services", () => ({
  deleteAd: vi.fn(),
  updateAd: vi.fn(),
}));

vi.mock("@/utils/getCurrentUser", () => ({
  default: vi.fn(),
}));

vi.mock("@/lib/validation/ad-validation", () => ({
  validateAdForm: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedDeleteAd = vi.mocked(deleteAd);
const mockedUpdateAd = vi.mocked(updateAd);
const mockedValidateAdForm = vi.mocked(validateAdForm);
const mockedRevalidatePath = vi.mocked(revalidatePath);

describe("deleteAdAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete the ad successfully", async () => {
    mockedGetCurrentUser.mockResolvedValue({
      _id: "user-123",
    } as never);

    mockedDeleteAd.mockResolvedValue({
      success: true,
    });

    const formData = new FormData();
    formData.append("id", "ad-123");

    await deleteAdAction(formData);

    expect(mockedDeleteAd).toHaveBeenCalledWith(
      "ad-123",
      "user-123",
    );

    expect(mockedRevalidatePath).toHaveBeenCalledWith(
      "/profile/ads",
    );
  });

  it("should throw when ad id is missing", async () => {
    const formData = new FormData();

    await expect(
      deleteAdAction(formData),
    ).rejects.toThrow(
      "شناسه آگهی نامعتبر است.",
    );

    expect(mockedDeleteAd).not.toHaveBeenCalled();
  });

  it("should throw when user is not authenticated", async () => {
    mockedGetCurrentUser.mockResolvedValue(
      null as never,
    );

    const formData = new FormData();
    formData.append("id", "ad-123");

    await expect(
      deleteAdAction(formData),
    ).rejects.toThrow(
      "کاربر وارد نشده است.",
    );

    expect(mockedDeleteAd).not.toHaveBeenCalled();
  });
});

describe("updateAdAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update the ad successfully", async () => {
    mockedGetCurrentUser.mockResolvedValue({
      _id: "user-123",
    } as never);

    mockedValidateAdForm.mockReturnValue({
      success: true,
      data: {
        title: "عنوان جدید",
      },
    } as never);

    const updatedAd = {
      _id: "ad-123",
      userId: "user-123",
      title: "عنوان جدید",
    };

    mockedUpdateAd.mockResolvedValue(
      updatedAd as never,
    );

    const formData = new FormData();
    formData.append("title", "عنوان جدید");

    const result = await updateAdAction(
      "ad-123",
      {} as never,
      formData,
    );

    expect(result).toEqual({
      success: true,
      data: updatedAd,
      message: "آگهی با موفقیت ویرایش شد.",
      errors: {},
    });

    expect(mockedUpdateAd).toHaveBeenCalledWith(
      "ad-123",
      "user-123",
      {
        title: "عنوان جدید",
      },
    );

    expect(mockedRevalidatePath).toHaveBeenCalledWith(
      "/profile/ads",
    );
  });

  it("should return validation errors", async () => {
    mockedGetCurrentUser.mockResolvedValue({
      _id: "user-123",
    } as never);

    mockedValidateAdForm.mockReturnValue({
      success: false,
      message: "اطلاعات وارد شده نامعتبر است.",
      errors: {
        title: "عنوان الزامی است.",
      },
    } as never);

    const formData = new FormData();

    const result = await updateAdAction(
      "ad-123",
      {} as never,
      formData,
    );

    expect(result).toEqual({
      success: false,
      message: "اطلاعات وارد شده نامعتبر است.",
      errors: {
        title: "عنوان الزامی است.",
      },
    });

    expect(mockedUpdateAd).not.toHaveBeenCalled();
  });

  it("should return authentication error", async () => {
    mockedGetCurrentUser.mockResolvedValue(
      null as never,
    );

    const formData = new FormData();

    const result = await updateAdAction(
      "ad-123",
      {} as never,
      formData,
    );

    expect(result).toEqual({
      success: false,
      message: "کاربر وارد نشده است.",
      errors: {},
    });

    expect(mockedValidateAdForm).not.toHaveBeenCalled();
    expect(mockedUpdateAd).not.toHaveBeenCalled();
  });

  it("should return invalid ad id error", async () => {
    mockedGetCurrentUser.mockResolvedValue({
      _id: "user-123",
    } as never);

    const formData = new FormData();

    const result = await updateAdAction(
      "",
      {} as never,
      formData,
    );

    expect(result).toEqual({
      success: false,
      message: "شناسه آگهی نامعتبر است.",
      errors: {},
    });

    expect(mockedValidateAdForm).not.toHaveBeenCalled();
    expect(mockedUpdateAd).not.toHaveBeenCalled();
  });

  it("should handle update service errors", async () => {
    mockedGetCurrentUser.mockResolvedValue({
      _id: "user-123",
    } as never);

    mockedValidateAdForm.mockReturnValue({
      success: true,
      data: {
        title: "عنوان جدید",
      },
    } as never);

    mockedUpdateAd.mockRejectedValue(
      new Error("آگهی متعلق به این کاربر نیست."),
    );

    const formData = new FormData();
    formData.append("title", "عنوان جدید");

    const result = await updateAdAction(
      "ad-123",
      {} as never,
      formData,
    );

    expect(result).toEqual({
      success: false,
      message: "آگهی متعلق به این کاربر نیست.",
      errors: {},
    });
  });
});