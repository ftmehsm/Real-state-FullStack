import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import SubmitButton from "./SubmitButton";

const mockUseFormStatus = vi.fn();

vi.mock("react-dom", () => ({
  useFormStatus: () => mockUseFormStatus(),
}));

describe("SubmitButton", () => {
  it("should render normal state", () => {
    mockUseFormStatus.mockReturnValue({
      pending: false,
    });

    render(<SubmitButton />);

    const button = screen.getByRole("button", {
      name: "ایجاد حساب",
    });

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("should show loading state when pending", () => {
    mockUseFormStatus.mockReturnValue({
      pending: true,
    });

    render(<SubmitButton />);

    const button = screen.getByRole("button", {
      name: "در حال ثبت...",
    });

    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("should have submit type", () => {
    mockUseFormStatus.mockReturnValue({
      pending: false,
    });

    render(<SubmitButton />);

    expect(
      screen.getByRole("button", {
        name: "ایجاد حساب",
      })
    ).toHaveAttribute("type", "submit");
  });
});