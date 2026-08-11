import { beforeEach, describe, expect, it, vi } from "vitest";
import { signupAction } from "./auth.actions";
import { signup } from "@/lib/services/auth.services";

vi.mock("@/lib/services/auth.services", () => ({
  signup: vi.fn(),
}));


const initialState = {
  success: false,
  message: "",
};

describe("signupAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return error when required fields are missing", async () => {
    const formData = new FormData();
  
    formData.set("name", "");
    formData.set("email", "test@example.com");
    formData.set("password", "123456");
    formData.set("repeatPassword", "123456");
  
    const result = await signupAction(initialState, formData);
  
    expect(result).toEqual({
      success: false,
      message: "تمامی فیلدها باید کامل شوند",
    });
  
    expect(signup).not.toHaveBeenCalled();
  });
  
  it("should return error when passwords do not match", async () => {
    const formData = new FormData();
  
    formData.set("name", "Test User");
    formData.set("email", "test@example.com");
    formData.set("password", "123456");
    formData.set("repeatPassword", "654321");
  
    const result = await signupAction(initialState, formData);
  
    expect(result).toEqual({
      success: false,
      message: "رمز عبور با تکرار رمز عبور یکی نیست",
    });
  
    expect(signup).not.toHaveBeenCalled();
  });

  it("should return error when email format is invalid", async () => {
    const formData = new FormData();
  
    formData.set("name", "Test User");
    formData.set("email", "invalid-email");
    formData.set("password", "123456");
    formData.set("repeatPassword", "123456");
  
    const result = await signupAction(initialState, formData);
  
    expect(result).toEqual({
      success: false,
      message: "فرمت ایمیل ورودی معتبر نیست",
    });
  
    expect(signup).not.toHaveBeenCalled();
  });
  
  it("should signup successfully with valid data", async () => {
    vi.mocked(signup).mockResolvedValue({} as any);
  
    const formData = new FormData();
  
    formData.set("name", "Test User");
    formData.set("email", "test@example.com");
    formData.set("password", "123456");
    formData.set("repeatPassword", "123456");
  
    const result = await signupAction(initialState, formData);
  
    expect(result).toEqual({
      success: true,
      message: "حساب کاربری با موفقیت ایجاد شد",
      email: "test@example.com",
    });
  
    expect(signup).toHaveBeenCalledOnce();
  
    expect(signup).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });
  });
  
  it("should return service error when signup fails", async () => {
    vi.mocked(signup).mockRejectedValue(
      new Error("این ایمیل قبلاً ثبت شده است.")
    );
  
    const formData = new FormData();
  
    formData.set("name", "Test User");
    formData.set("email", "test@example.com");
    formData.set("password", "123456");
    formData.set("repeatPassword", "123456");
  
    const result = await signupAction(initialState, formData);
  
    expect(result).toEqual({
      success: false,
      message: "این ایمیل قبلاً ثبت شده است.",
    });
  
    expect(signup).toHaveBeenCalledOnce();
  });
});



