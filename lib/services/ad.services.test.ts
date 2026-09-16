import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  deleteAd,
  getAdById,
  getMyAds,
  updateAd,
} from "@/lib/services/ad.services";

import connectDB from "@/utils/connectDB";
import { Ad } from "@/models/Ad";
import { Types } from "mongoose";

vi.mock("@/utils/connectDB", () => ({
  default: vi.fn(),
}));

vi.mock("@/models/Ad", () => ({
  Ad: {
    find: vi.fn(),
    findById: vi.fn(),
    findOneAndDelete: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}));

const mockedConnectDB = vi.mocked(connectDB);

const mockedAd = vi.mocked(Ad);

describe("getMyAds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw error for invalid user id", async () => {
    await expect(
      getMyAds("invalid-user-id"),
    ).rejects.toThrow(
      "شناسه کاربر نامعتبر است.",
    );

    expect(mockedConnectDB).toHaveBeenCalledTimes(1);
    expect(mockedAd.find).not.toHaveBeenCalled();
  });

  it("should return user's ads", async () => {
    const userId = new Types.ObjectId().toString();

    const createdAt = new Date("2025-01-01T10:00:00.000Z");
    const updatedAt = new Date("2025-01-02T10:00:00.000Z");

    const adId = new Types.ObjectId();

    const ads = [
      {
        _id: adId,
        userId: new Types.ObjectId(userId),
        title: "آگهی اول",
        createdAt,
        updatedAt,
      },
    ];

    const leanMock = vi.fn().mockResolvedValue(ads);

    const sortMock = vi.fn().mockReturnValue({
      lean: leanMock,
    });

    mockedAd.find.mockReturnValue({
      sort: sortMock,
    } as never);

    const result = await getMyAds(userId);

    expect(mockedAd.find).toHaveBeenCalledWith({
      userId,
    });

    expect(sortMock).toHaveBeenCalledWith({
      createdAt: -1,
    });

    expect(result).toEqual([
      {
        _id: adId.toString(),
        userId,
        title: "آگهی اول",
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      },
    ]);
  });

  it("should return empty array when user has no ads", async () => {
    const userId = new Types.ObjectId().toString();

    const leanMock = vi.fn().mockResolvedValue([]);

    const sortMock = vi.fn().mockReturnValue({
      lean: leanMock,
    });

    mockedAd.find.mockReturnValue({
      sort: sortMock,
    } as never);

    const result = await getMyAds(userId);

    expect(result).toEqual([]);

    expect(mockedAd.find).toHaveBeenCalledWith({
      userId,
    });
  });
});

describe("deleteAd", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw error for invalid ad id", async () => {
    const userId = new Types.ObjectId().toString();

    await expect(
      deleteAd("invalid-ad-id", userId),
    ).rejects.toThrow(
      "شناسه آگهی نامعتبر است.",
    );

    expect(mockedAd.findOneAndDelete).not.toHaveBeenCalled();
  });

  it("should throw error for invalid user id", async () => {
    const adId = new Types.ObjectId().toString();

    await expect(
      deleteAd(adId, "invalid-user-id"),
    ).rejects.toThrow(
      "شناسه کاربر نامعتبر است.",
    );

    expect(mockedAd.findOneAndDelete).not.toHaveBeenCalled();
  });

  it("should delete the ad successfully", async () => {
    const adId = new Types.ObjectId().toString();
    const userId = new Types.ObjectId().toString();

    mockedAd.findOneAndDelete.mockResolvedValue({
      _id: adId,
      userId,
    } as never);

    const result = await deleteAd(
      adId,
      userId,
    );

    expect(
      mockedAd.findOneAndDelete,
    ).toHaveBeenCalledWith({
      _id: adId,
      userId,
    });

    expect(result).toEqual({
      success: true,
    });
  });

  it("should throw error when ad does not exist or does not belong to user", async () => {
    const adId = new Types.ObjectId().toString();
    const userId = new Types.ObjectId().toString();

    mockedAd.findOneAndDelete.mockResolvedValue(
      null,
    );

    await expect(
      deleteAd(adId, userId),
    ).rejects.toThrow(
      "آگهی پیدا نشد یا متعلق به این کاربر نیست.",
    );

    expect(
      mockedAd.findOneAndDelete,
    ).toHaveBeenCalledWith({
      _id: adId,
      userId,
    });
  });
});

describe("getAdById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw error for invalid ad id", async () => {
    await expect(
      getAdById("invalid-ad-id"),
    ).rejects.toThrow(
      "شناسه آگهی نامعتبر است.",
    );

    expect(mockedAd.findById).not.toHaveBeenCalled();
  });

  it("should throw error when ad does not exist", async () => {
    const adId = new Types.ObjectId().toString();

    const leanMock = vi.fn().mockResolvedValue(
      null,
    );

    mockedAd.findById.mockReturnValue({
      lean: leanMock,
    } as never);

    await expect(
      getAdById(adId),
    ).rejects.toThrow(
      "آگهی پیدا نشد.",
    );

    expect(
      mockedAd.findById,
    ).toHaveBeenCalledWith(adId);
  });

  it("should return serialized ad", async () => {
    const adId = new Types.ObjectId();
    const userId = new Types.ObjectId();

    const imageId = new Types.ObjectId();

    const createdAt = new Date(
      "2025-01-01T10:00:00.000Z",
    );

    const updatedAt = new Date(
      "2025-01-02T10:00:00.000Z",
    );

    const ad = {
      _id: adId,
      userId,
      title: "آگهی تست",
      description: "توضیحات تست",
      images: [
        {
          _id: imageId,
          url: "https://example.com/image.jpg",
          key: "image-key",
        },
      ],
      createdAt,
      updatedAt,
    };

    const leanMock = vi.fn().mockResolvedValue(
      ad,
    );

    mockedAd.findById.mockReturnValue({
      lean: leanMock,
    } as never);

    const result = await getAdById(
      adId.toString(),
    );

    expect(
      mockedAd.findById,
    ).toHaveBeenCalledWith(
      adId.toString(),
    );

    expect(result).toEqual({
      _id: adId.toString(),
      userId: userId.toString(),
      title: "آگهی تست",
      description: "توضیحات تست",
      images: [
        {
          _id: imageId.toString(),
          url: "https://example.com/image.jpg",
          key: "image-key",
        },
      ],
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
  });
});

describe("updateAd", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw error for invalid ad id", async () => {
    const userId = new Types.ObjectId().toString();

    await expect(
      updateAd(
        "invalid-ad-id",
        userId,
        {},
      ),
    ).rejects.toThrow(
      "شناسه آگهی نامعتبر است.",
    );

    expect(
      mockedAd.findOneAndUpdate,
    ).not.toHaveBeenCalled();
  });

  it("should throw error for invalid user id", async () => {
    const adId = new Types.ObjectId().toString();

    await expect(
      updateAd(
        adId,
        "invalid-user-id",
        {},
      ),
    ).rejects.toThrow(
      "شناسه کاربر نامعتبر است.",
    );

    expect(
      mockedAd.findOneAndUpdate,
    ).not.toHaveBeenCalled();
  });

  it("should update the ad successfully", async () => {
    const adId = new Types.ObjectId();
    const userId = new Types.ObjectId();

    const createdAt = new Date(
      "2025-01-01T10:00:00.000Z",
    );

    const updatedAt = new Date(
      "2025-01-02T10:00:00.000Z",
    );

    const data = {
      title: "عنوان جدید",
      description: "توضیحات جدید",
    };

    const updatedAd = {
      _id: adId,
      userId,
      ...data,
      createdAt,
      updatedAt,
    };

    const leanMock = vi.fn().mockResolvedValue(
      updatedAd,
    );

    mockedAd.findOneAndUpdate.mockReturnValue({
      lean: leanMock,
    } as never);

    const result = await updateAd(
      adId.toString(),
      userId.toString(),
      data,
    );

    expect(
      mockedAd.findOneAndUpdate,
    ).toHaveBeenCalledWith(
      {
        _id: adId.toString(),
        userId: userId.toString(),
      },
      data,
      {
        new: true,
        runValidators: true,
      },
    );

    expect(result).toEqual({
      _id: adId.toString(),
      userId: userId.toString(),
      title: "عنوان جدید",
      description: "توضیحات جدید",
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
  });

  it("should throw error when ad does not exist or does not belong to user", async () => {
    const adId = new Types.ObjectId().toString();
    const userId = new Types.ObjectId().toString();

    const leanMock = vi.fn().mockResolvedValue(
      null,
    );

    mockedAd.findOneAndUpdate.mockReturnValue({
      lean: leanMock,
    } as never);

    await expect(
      updateAd(
        adId,
        userId,
        {
          title: "عنوان جدید",
        },
      ),
    ).rejects.toThrow(
      "آگهی پیدا نشد یا متعلق به این کاربر نیست.",
    );

    expect(
      mockedAd.findOneAndUpdate,
    ).toHaveBeenCalledWith(
      {
        _id: adId,
        userId,
      },
      {
        title: "عنوان جدید",
      },
      {
        new: true,
        runValidators: true,
      },
    );
  });
});