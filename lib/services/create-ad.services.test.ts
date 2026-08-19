import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
  } from "vitest";
  
  import { createAd } from "@/lib/services/create-ad.services";
  
  import connectDB from "@/utils/connectDB";
  import User from "@/models/User";
  import { Ad } from "@/models/Ad";
  import { getServerSession } from "next-auth";
  
  vi.mock("@/utils/connectDB", () => ({
    default: vi.fn(),
  }));
  
  vi.mock("@/models/User", () => ({
    default: {
      findOne: vi.fn(),
    },
  }));
  
  vi.mock("@/models/Ad", () => ({
    Ad: {
      create: vi.fn(),
    },
  }));
  
  vi.mock("next-auth", () => ({
    getServerSession: vi.fn(),
  }));
  
  vi.mock(
    "@/app/api/auth/[...nextauth]/route",
    () => ({
      authOptions: {},
    }),
  );
  
  vi.mock("mongoose", () => ({
    Types: {
      ObjectId: class MockObjectId {
        value: string;
  
        constructor(value: string) {
          this.value = value;
        }
  
        toString() {
          return this.value;
        }
      },
    },
  }));
  
  const mockedConnectDB = vi.mocked(connectDB);
  const mockedFindOne = vi.mocked(User.findOne);
  const mockedAdCreate = vi.mocked(Ad.create);
  const mockedGetServerSession =
    vi.mocked(getServerSession);
  
  const images = [
    {
      url: "https://ufs.sh/f/image-1",
      key: "image-1",
    },
  ];
  
  const validData = {
    name: "آپارتمان ۱۲۰ متری",
    description: "آپارتمان نوساز",
    address: "تهران، منطقه ۲",
    phone: "09123456789",
    agency: "املاک مرکزی",
    category: "apartment",
  
    transactionType: "buy" as const,
  
    price: 5000000000,
  
    area: 120,
  
    amenities: [
      "پارکینگ",
      "آسانسور",
    ],
  
    rules: [
      "بدون حیوان خانگی",
    ],
  
    constructionDate: "1402/01/01",
  
    images,
  };
  
  describe("createAd", () => {
    beforeEach(() => {
      vi.clearAllMocks();
  
      mockedConnectDB.mockResolvedValue(
        undefined,
      );
  
      mockedGetServerSession.mockResolvedValue({
        user: {
          email: "test@example.com",
        },
      } as never);
  
      mockedFindOne.mockResolvedValue({
        _id: "user-1",
        email: "test@example.com",
      } as never);
  
      mockedAdCreate.mockResolvedValue({
        _id: "ad-1",
        ...validData,
        userId: "user-1",
        toObject() {
          return {
            _id: "ad-1",
            ...validData,
            userId: "user-1",
          };
        },
      } as never);
    });
  
    it("should connect to database", async () => {
      await createAd(validData);
  
      expect(mockedConnectDB).toHaveBeenCalledTimes(1);
    });
  
    it("should reject unauthenticated user", async () => {
      mockedGetServerSession.mockResolvedValue(
        null,
      );
  
      await expect(
        createAd(validData),
      ).rejects.toThrow(
        "به حساب کاربری خود وارد شوید",
      );
  
      expect(mockedFindOne).not.toHaveBeenCalled();
  
      expect(mockedAdCreate).not.toHaveBeenCalled();
    });
  
    it("should reject user without email", async () => {
      mockedGetServerSession.mockResolvedValue({
        user: {},
      } as never);
  
      await expect(
        createAd(validData),
      ).rejects.toThrow(
        "به حساب کاربری خود وارد شوید",
      );
  
      expect(mockedAdCreate).not.toHaveBeenCalled();
    });
  
    it("should reject when user does not exist", async () => {
      mockedFindOne.mockResolvedValue(null);
  
      await expect(
        createAd(validData),
      ).rejects.toThrow(
        "حساب کاربری مورد نظر یافت نشد",
      );
  
      expect(mockedAdCreate).not.toHaveBeenCalled();
    });
  
    it("should create buy ad correctly", async () => {
      await createAd(validData);
  
      expect(mockedFindOne).toHaveBeenCalledWith({
        email: "test@example.com",
      });
  
      expect(mockedAdCreate).toHaveBeenCalledTimes(1);
  
      const createdData =
        mockedAdCreate.mock.calls[0][0];
  
      expect(createdData).toMatchObject({
        name: "آپارتمان ۱۲۰ متری",
        description: "آپارتمان نوساز",
        address: "تهران، منطقه ۲",
        phone: "09123456789",
        agency: "املاک مرکزی",
        category: "apartment",
        transactionType: "buy",
        price: 5000000000,
        area: 120,
        amenities: [
          "پارکینگ",
          "آسانسور",
        ],
        rules: [
          "بدون حیوان خانگی",
        ],
        constructionDate: "1402/01/01",
        images,
      });
  
      expect(createdData).toHaveProperty(
        "userId",
      );
  
      expect(createdData).not.toHaveProperty(
        "deposit",
      );
  
      expect(createdData).not.toHaveProperty(
        "rent",
      );
    });
  
    it("should create rent ad correctly", async () => {
      const rentData = {
        ...validData,
        transactionType: "rent" as const,
        price: undefined,
        deposit: 500000000,
        rent: 15000000,
      };
  
      await createAd(rentData);
  
      const createdData =
        mockedAdCreate.mock.calls[0][0];
  
      expect(createdData).toMatchObject({
        transactionType: "rent",
        deposit: 500000000,
        rent: 15000000,
        images,
      });
  
      expect(createdData).not.toHaveProperty(
        "price",
      );
    });
  
    it("should store image url and key", async () => {
      await createAd(validData);
  
      const createdData =
        mockedAdCreate.mock.calls[0][0];
  
      expect(createdData.images).toEqual([
        {
          url: "https://ufs.sh/f/image-1",
          key: "image-1",
        },
      ]);
    });
  
    it("should return created ad data", async () => {
      const result = await createAd(validData);
  
      expect(result).toMatchObject({
        id: "ad-1",
        name: "آپارتمان ۱۲۰ متری",
        transactionType: "buy",
        images,
      });
    });
  
    it("should propagate database errors", async () => {
      mockedAdCreate.mockRejectedValue(
        new Error("MongoDB error"),
      );
  
      await expect(
        createAd(validData),
      ).rejects.toThrow(
        "MongoDB error",
      );
    });
  });