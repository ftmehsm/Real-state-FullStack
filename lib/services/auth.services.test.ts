import { beforeEach, describe, expect, it, vi } from "vitest";

import { login, signup } from "./auth.services";

import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import { hashPassword, verifyPassword } from "@/utils/auth";

vi.mock("@/utils/connectDB", () => ({
  default: vi.fn(),
}));

vi.mock("@/models/User", () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("@/utils/auth", () => ({
  verifyPassword: vi.fn(),
  hashPassword: vi.fn(),
}));

describe("login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw an error when email is missing", async () => {
    await expect(
      login({
        email: "",
        password: "123456",
      }),
    ).rejects.toThrow("ایمیل و رمز عبور الزامیست");

    expect(User.findOne).not.toHaveBeenCalled();
    expect(verifyPassword).not.toHaveBeenCalled();
  });

  it("should throw an error when password is missing", async () => {
    await expect(
      login({
        email: "test@example.com",
        password: "",
      }),
    ).rejects.toThrow("ایمیل و رمز عبور الزامیست");

    expect(User.findOne).not.toHaveBeenCalled();
    expect(verifyPassword).not.toHaveBeenCalled();
  });

  it("should throw an error when user does not exist", async () => {
    vi.mocked(User.findOne).mockResolvedValue(null);

    await expect(
      login({
        email: "test@example.com",
        password: "123456",
      }),
    ).rejects.toThrow("کاربری با این ایمیل یافت نشد. لطفا ابتدا ثبت نام کنید");
  });

  it("should throw an error when password is incorrect", async () => {
    const user = {
      _id: "user-id",
      name: "Test User",
      email: "test@example.com",
      password: "hashed-password",
    };

    vi.mocked(User.findOne).mockResolvedValue(user as any);

    vi.mocked(verifyPassword).mockResolvedValue(false);

    await expect(
      login({
        email: "test@example.com",
        password: "wrong-password",
      }),
    ).rejects.toThrow("ایمیل یا رمز عبور اشتباه است");
  });

  it("should return user when credentials are valid", async () => {
    const user = {
      _id: "user-id",
      name: "Test User",
      email: "test@example.com",
      password: "hashed-password",
    };

    vi.mocked(User.findOne).mockResolvedValue(user as any);
    vi.mocked(verifyPassword).mockResolvedValue(true);

    const result = await login({
      email: "test@example.com",
      password: "correct-password",
    });

    expect(result).toEqual(user);

    expect(connectDB).toHaveBeenCalledOnce();

    expect(User.findOne).toHaveBeenCalledOnce();
    expect(User.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });

    expect(verifyPassword).toHaveBeenCalledOnce();
    expect(verifyPassword).toHaveBeenCalledWith(
      "correct-password",
      "hashed-password",
    );
  });
});

//signup
describe("signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw an error when email is already registered", async () => {
    const existingUser = {
      _id: "user-id",
      name: "Existing User",
      email: "test@example.com",
      password: "hashed-password",
    };

    vi.mocked(User.findOne).mockResolvedValue(existingUser as any);

    await expect(
      signup({
        name: "Test User",
        email: "test@example.com",
        password: "123456",
      }),
    ).rejects.toThrow("این ایمیل قبلاً ثبت شده است.");

    expect(User.findOne).toHaveBeenCalledOnce();
    expect(User.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });

    expect(hashPassword).not.toHaveBeenCalled();
    expect(User.create).not.toHaveBeenCalled();
  });

  it("should create a new user successfully", async () => {
    const user = {
      _id: "user-id",
      name: "Test User",
      email: "test@example.com",
      password: "hashed-password",
    };

    vi.mocked(User.findOne).mockResolvedValue(null);

    vi.mocked(hashPassword).mockResolvedValue("hashed-password");

    vi.mocked(User.create).mockResolvedValue(user as any);

    const result = await signup({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });

    expect(result).toEqual(user);

    expect(connectDB).toHaveBeenCalledOnce();

    expect(User.findOne).toHaveBeenCalledOnce();
    expect(User.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });

    expect(hashPassword).toHaveBeenCalledOnce();
    expect(hashPassword).toHaveBeenCalledWith("123456");

    expect(User.create).toHaveBeenCalledOnce();
    expect(User.create).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
      password: "hashed-password",
    });
  });
});
