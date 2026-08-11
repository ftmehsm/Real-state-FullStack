import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LoginForm from "./LoginForm";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

const pushMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(useRouter).mockReturnValue({
    push: pushMock,
  } as any);
});

describe("LoginForm", () => {
  it("should render login form", () => {
    render(<LoginForm />);

    expect(
      screen.getByRole("heading", {
        name: "ورود به حساب",
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("ایمیل")).toBeInTheDocument();

    expect(screen.getByLabelText("رمز عبور")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "ورود",
      }),
    ).toBeInTheDocument();
  });

  it("should login successfully and redirect to home", async () => {
    const user = userEvent.setup();

    vi.mocked(signIn).mockResolvedValue({
      ok: true,
      error: null,
      status: 200,
      url: null,
    } as any);

    render(<LoginForm />);

    await user.type(screen.getByLabelText("ایمیل"), "test@example.com");

    await user.type(screen.getByLabelText("رمز عبور"), "123456");

    await user.click(
      screen.getByRole("button", {
        name: "ورود",
      }),
    );

    expect(signIn).toHaveBeenCalledOnce();

    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: "test@example.com",
      password: "123456",
      redirect: false,
    });

    expect(pushMock).toHaveBeenCalledOnce();

    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("should show error when login fails", async () => {
    const user = userEvent.setup();

    vi.mocked(signIn).mockResolvedValue({
      ok: false,
      error: "CredentialsSignin",
      status: 401,
      url: null,
    } as any);

    render(<LoginForm />);

    await user.type(screen.getByLabelText("ایمیل"), "test@example.com");

    await user.type(screen.getByLabelText("رمز عبور"), "wrong-password");

    await user.click(
      screen.getByRole("button", {
        name: "ورود",
      }),
    );

    expect(
      await screen.findByText("ایمیل یا رمز عبور اشتباه است"),
    ).toBeInTheDocument();

    expect(pushMock).not.toHaveBeenCalled();
  });

  it("should show generic error when signIn throws", async () => {
    const user = userEvent.setup();

    vi.mocked(signIn).mockRejectedValue(new Error("Network error"));

    render(<LoginForm />);

    await user.type(screen.getByLabelText("ایمیل"), "test@example.com");

    await user.type(screen.getByLabelText("رمز عبور"), "123456");

    await user.click(
      screen.getByRole("button", {
        name: "ورود",
      }),
    );

    expect(
      await screen.findByText("خطایی در ورود رخ داده است"),
    ).toBeInTheDocument();

    expect(pushMock).not.toHaveBeenCalled();
  });

  it("should show loading state while login is pending", async () => {
    const user = userEvent.setup();

    let resolveLogin!: (value: any) => void;

    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });

    vi.mocked(signIn).mockReturnValue(loginPromise as any);

    render(<LoginForm />);

    await user.type(screen.getByLabelText("ایمیل"), "test@example.com");

    await user.type(screen.getByLabelText("رمز عبور"), "123456");

    const button = screen.getByRole("button", {
      name: "ورود",
    });

    await user.click(button);

    expect(
      screen.getByRole("button", {
        name: "در حال ورود...",
      }),
    ).toBeDisabled();

    resolveLogin({
      ok: true,
      error: null,
      status: 200,
      url: null,
    });

    await vi.waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "ورود",
        }),
      ).not.toBeDisabled();
    });
  });
});
