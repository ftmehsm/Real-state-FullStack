import { beforeEach, describe, expect, it, vi } from "vitest";

import { credentialsProvider } from "./route";

import { login } from "@/lib/services/auth.services";

vi.mock("@/lib/services/auth.services", () => ({
  login: vi.fn(),
}));

describe("NextAuth Credentials authorize", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null when credentials are missing", async () => {
    const authorize = credentialsProvider.options.authorize;

    const result = await authorize(undefined);

    expect(result).toBeNull();

    expect(login).not.toHaveBeenCalled();
  });

  it("should return user when login succeeds", async () => {
    const user = {
      id: "user-id",
      email: "test@example.com",
    };
  
    vi.mocked(login).mockResolvedValue(user as any);
  
    const authorize = credentialsProvider.options.authorize;
  
    const result = await authorize({
      email: "test@example.com",
      password: "123456",
    });
  
    expect(result).toEqual(user);
  
    expect(login).toHaveBeenCalledOnce();
  
    expect(login).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "123456",
    });
  });

  it("should return null when login returns null", async () => {
    vi.mocked(login).mockResolvedValue(null);
  
    const authorize = credentialsProvider.options.authorize;
  
    const result = await authorize({
      email: "test@example.com",
      password: "123456",
    });
  
    expect(result).toBeNull();
  
    expect(login).toHaveBeenCalledOnce();
  
    expect(login).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "123456",
    });
  });

  it("should return null when login throws an error", async () => {
    vi.mocked(login).mockRejectedValue(
      new Error("ایمیل یا رمز عبور اشتباه است")
    );
  
    const authorize = credentialsProvider.options.authorize;
  
    const result = await authorize({
      email: "test@example.com",
      password: "wrong-password",
    });
  
    expect(result).toBeNull();
  
    expect(login).toHaveBeenCalledOnce();
  
    expect(login).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "wrong-password",
    });
  });
});
