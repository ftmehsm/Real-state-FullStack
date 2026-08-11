import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SignUpForm from "./SignUpForm";

import { signupAction } from "@/app/actions/auth.actions";
import { useRouter } from "next/navigation";

vi.mock("@/app/actions/auth.actions", () => ({
  signupAction: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("./SubmitButton", () => ({
  default: () => <button type="submit">ثبت‌نام</button>,
}));

const pushMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(useRouter).mockReturnValue({
    push: pushMock,
  } as any);
});

describe("SignUpForm", () => {
  it("should render signup form", () => {
    render(<SignUpForm />);

    expect(screen.getByText("ایجاد حساب کاربری")).toBeInTheDocument();

    expect(screen.getByLabelText("نام")).toBeInTheDocument();

    expect(screen.getByLabelText("ایمیل")).toBeInTheDocument();

    expect(screen.getByLabelText("رمز عبور")).toBeInTheDocument();

    expect(screen.getByLabelText("تکرار رمز عبور")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "ثبت‌نام",
      }),
    ).toBeInTheDocument();
  });

  it("should submit correct form data", async () => {
    const user = userEvent.setup();

    vi.mocked(signupAction).mockResolvedValue({
      success: false,
      message: "test",
    });

    render(<SignUpForm />);

    await user.type(screen.getByLabelText("نام"), "Test User");

    await user.type(screen.getByLabelText("ایمیل"), "test@example.com");

    await user.type(screen.getByLabelText("رمز عبور"), "123456");

    await user.type(screen.getByLabelText("تکرار رمز عبور"), "123456");

    await user.click(
      screen.getByRole("button", {
        name: "ثبت‌نام",
      }),
    );

    await vi.waitFor(() => {
      expect(signupAction).toHaveBeenCalled();
    });

    const [, formData] = vi.mocked(signupAction).mock.calls[0];

    expect(formData.get("name")).toBe("Test User");
    expect(formData.get("email")).toBe("test@example.com");
    expect(formData.get("password")).toBe("123456");
    expect(formData.get("repeatPassword")).toBe("123456");
  });

  it("should show error message when signup fails", async () => {
    const user = userEvent.setup();

    vi.mocked(signupAction).mockResolvedValue({
      success: false,
      message: "این ایمیل قبلاً ثبت شده است.",
    });

    render(<SignUpForm />);

    await user.type(screen.getByLabelText("نام"), "Test User");

    await user.type(screen.getByLabelText("ایمیل"), "test@example.com");

    await user.type(screen.getByLabelText("رمز عبور"), "123456");

    await user.type(screen.getByLabelText("تکرار رمز عبور"), "123456");

    await user.click(
      screen.getByRole("button", {
        name: "ثبت‌نام",
      }),
    );

    expect(
      await screen.findByText("این ایمیل قبلاً ثبت شده است."),
    ).toBeInTheDocument();

    expect(pushMock).not.toHaveBeenCalled();
  });

  it("should redirect to login after successful signup", async () => {
    const user = userEvent.setup();

    vi.mocked(signupAction).mockResolvedValue({
      success: true,
      message: "حساب کاربری با موفقیت ایجاد شد",
    });

    render(<SignUpForm />);

    await user.type(screen.getByLabelText("نام"), "Test User");

    await user.type(screen.getByLabelText("ایمیل"), "test@example.com");

    await user.type(screen.getByLabelText("رمز عبور"), "123456");

    await user.type(screen.getByLabelText("تکرار رمز عبور"), "123456");

    await user.click(
      screen.getByRole("button", {
        name: "ثبت‌نام",
      }),
    );

    await vi.waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/login");
    });
  });

  it("should not redirect when signup fails", async () => {
    const user = userEvent.setup();

    vi.mocked(signupAction).mockResolvedValue({
      success: false,
      message: "رمز عبور با تکرار رمز عبور یکی نیست",
    });

    render(<SignUpForm />);

    await user.type(screen.getByLabelText("نام"), "Test User");

    await user.type(screen.getByLabelText("ایمیل"), "test@example.com");

    await user.type(screen.getByLabelText("رمز عبور"), "123456");

    await user.type(screen.getByLabelText("تکرار رمز عبور"), "654321");

    await user.click(
      screen.getByRole("button", {
        name: "ثبت‌نام",
      }),
    );

    expect(
      await screen.findByText("رمز عبور با تکرار رمز عبور یکی نیست"),
    ).toBeInTheDocument();

    expect(pushMock).not.toHaveBeenCalled();
  });
});
