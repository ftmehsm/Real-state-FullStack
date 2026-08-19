import { beforeEach, describe, expect, it, vi } from "vitest";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import CreateAdForm from "@/components/ads/CreateAdForm";

vi.mock("@/utils/uploadthing", () => ({
  UploadDropzone: ({
    onClientUploadComplete,
    onUploadError,
  }: {
    onClientUploadComplete?: (
      files: Array<{
        ufsUrl: string;
        key: string;
      }>,
    ) => void;

    onUploadError?: (error: Error) => void;
  }) => {
    return (
      <div>
        <button
          type="button"
          data-testid="mock-upload"
          onClick={() => {
            onClientUploadComplete?.([
              {
                ufsUrl: "https://ufs.sh/f/image-1",
                key: "image-1",
              },
            ]);
          }}
        >
          Upload
        </button>

        <button
          type="button"
          data-testid="mock-upload-error"
          onClick={() => {
            onUploadError?.(new Error("Upload failed"));
          }}
        >
          Upload Error
        </button>
      </div>
    );
  },
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div>{children}</div>,

  CardContent: ({ children }: any) => <div>{children}</div>,

  CardHeader: ({ children }: any) => <div>{children}</div>,

  CardTitle: ({ children }: any) => <h1>{children}</h1>,
}));

vi.mock("@/components/ui/separator", () => ({
  Separator: () => <hr />,
}));

vi.mock("@/components/ui/label", () => ({
  Label: ({
    children,
    htmlFor,
  }: {
    children: React.ReactNode;
    htmlFor?: string;
  }) => <label htmlFor={htmlFor}>{children}</label>,
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));

vi.mock("@/components/ui/textarea", () => ({
  Textarea: (props: any) => <textarea {...props} />,
}));

vi.mock("@/components/ui/button", () => ({
  Button: (props: any) => <button {...props} />,
}));

/**
 * Select mock
 *
 * نکته مهم:
 * Select واقعی Radix است و در تست نباید آن را
 * با select تو در تو شبیه‌سازی کنیم.
 *
 * این mock فقط رفتار مورد نیاز فرم را شبیه‌سازی می‌کند:
 *
 * value
 * defaultValue
 * onValueChange
 * name
 */
vi.mock("@/components/ui/select", () => ({
  Select: ({ children, value, defaultValue, onValueChange, name }: any) => (
    <select
      name={name}
      value={value ?? defaultValue ?? ""}
      onChange={(event) => {
        onValueChange?.(event.target.value);
      }}
    >
      {children}
    </select>
  ),

  SelectTrigger: () => null,

  SelectValue: () => null,

  SelectContent: ({ children }: any) => <>{children}</>,

  SelectItem: ({ value, children }: any) => (
    <option value={value}>{children}</option>
  ),
}));

vi.mock("@/components/dynamic-string-list", () => ({
  default: ({ name, values }: { name: string; values: string[] }) => (
    <>
      {values.map((value, index) => (
        <input key={`${name}-${index}`} name={name} value={value} readOnly />
      ))}
    </>
  ),
}));

vi.mock("react-multi-date-picker", () => ({
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: any) => void;
  }) => (
    <input
      data-testid="date-picker"
      value={value}
      onChange={(event) =>
        onChange({
          format: () => event.target.value,
        })
      }
      readOnly={false}
    />
  ),
}));

vi.mock("react-date-object/calendars/persian", () => ({
  default: {},
}));

vi.mock("react-date-object/locales/persian_fa", () => ({
  default: {},
}));

vi.mock("@/components/ui/toast", () => ({
  toast: {
    add: vi.fn(),
  },
}));

const categories = [
  {
    key: "apartment",
    name: "آپارتمان",
  },
  {
    key: "villa",
    name: "ویلا",
  },
];

function createAction() {
  return vi.fn().mockResolvedValue({
    success: true,
    data: {
      id: "ad-1",
    },
    message: "آگهی با موفقیت ایجاد شد.",
    errors: {},
  });
}

function renderForm(overrides: Record<string, unknown> = {}) {
  const action = createAction();

  const initialData = {
    name: "",
    description: "",
    address: "",
    phone: "",
    agency: "",
    category: "apartment",

    transactionType: "buy" as const,

    price: 5000000000,
    deposit: 0,
    rent: 0,

    area: 120,

    amenities: [],
    rules: [],

    constructionDate: "1402/01/01",

    images: [],

    ...overrides,
  };

  render(
    <CreateAdForm
      initialData={initialData}
      categories={categories}
      action={action}
      isEditing={false}
    />,
  );

  return {
    action,
  };
}

describe("CreateAdForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render create form", () => {
    renderForm();

    expect(
      screen.getByRole("heading", {
        name: "ثبت آگهی",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("اطلاعات اصلی")).toBeInTheDocument();

    expect(screen.getByText("اطلاعات معامله")).toBeInTheDocument();

    expect(screen.getByText("تصاویر ملک")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "ثبت آگهی",
      }),
    ).toBeInTheDocument();
  });

  it("should render edit mode", () => {
    render(
      <CreateAdForm
        initialData={{
          name: "آپارتمان",
          description: "توضیحات",
          address: "تهران",
          phone: "09123456789",
          agency: "",
          category: "apartment",

          transactionType: "buy",

          price: 100,
          deposit: 0,
          rent: 0,

          area: 100,

          amenities: [],
          rules: [],

          constructionDate: "1400/01/01",

          images: [],
        }}
        categories={categories}
        action={createAction()}
        isEditing
      />,
    );

    expect(screen.getByText("ویرایش آگهی")).toBeInTheDocument();

    expect(screen.getByText("ذخیره تغییرات")).toBeInTheDocument();
  });

  it("should show price for buy", () => {
    renderForm({
      transactionType: "buy",
    });

    expect(screen.getByLabelText("مبلغ")).toBeInTheDocument();

    expect(screen.queryByLabelText("ودیعه")).not.toBeInTheDocument();

    expect(screen.queryByLabelText("اجاره ماهانه")).not.toBeInTheDocument();
  });

  it("should show deposit and rent for rent", () => {
    renderForm({
      transactionType: "rent",
    });

    expect(screen.queryByLabelText("مبلغ")).not.toBeInTheDocument();

    expect(screen.getByLabelText("ودیعه")).toBeInTheDocument();

    expect(screen.getByLabelText("اجاره ماهانه")).toBeInTheDocument();
  });

  it("should switch from buy to rent", () => {
    renderForm({
      transactionType: "buy",
    });

    /**
     * به جای getByLabelText:
     *
     * چون Select واقعی Radix است و mock شده،
     * مستقیماً select مربوط به transactionType
     * را پیدا می‌کنیم.
     */
    const select = document.querySelector(
      'select[name="transactionType"]',
    ) as HTMLSelectElement;

    expect(select).toBeInTheDocument();

    expect(select.value).toBe("buy");

    fireEvent.change(select, {
      target: {
        value: "rent",
      },
    });

    expect(select.value).toBe("rent");

    expect(screen.getByLabelText("ودیعه")).toBeInTheDocument();

    expect(screen.getByLabelText("اجاره ماهانه")).toBeInTheDocument();

    expect(screen.queryByLabelText("مبلغ")).not.toBeInTheDocument();
  });

  it("should switch from rent to buy", () => {
    renderForm({
      transactionType: "rent",
    });

    const select = document.querySelector(
      'select[name="transactionType"]',
    ) as HTMLSelectElement;

    expect(select).toBeInTheDocument();

    expect(select.value).toBe("rent");

    fireEvent.change(select, {
      target: {
        value: "buy",
      },
    });

    expect(select.value).toBe("buy");

    expect(screen.getByLabelText("مبلغ")).toBeInTheDocument();

    expect(screen.queryByLabelText("ودیعه")).not.toBeInTheDocument();

    expect(screen.queryByLabelText("اجاره ماهانه")).not.toBeInTheDocument();
  });

  it("should upload an image and add it to hidden input", async () => {
    renderForm();

    fireEvent.click(screen.getByTestId("mock-upload"));

    await waitFor(() => {
      const input = document.querySelector(
        'input[name="images"]',
      ) as HTMLInputElement;

      expect(input).toBeTruthy();

      expect(JSON.parse(input.value)).toEqual([
        {
          url: "https://ufs.sh/f/image-1",
          key: "image-1",
        },
      ]);
    });

    expect(screen.getByAltText("تصویر ملک")).toBeInTheDocument();

    expect(screen.getByText("1 از 2 تصویر")).toBeInTheDocument();
  });

  it("should initialize existing images in edit mode", () => {
    renderForm({
      images: [
        {
          url: "https://ufs.sh/f/existing",
          key: "existing",
        },
      ],
    });

    const hiddenInput = document.querySelector(
      'input[name="images"]',
    ) as HTMLInputElement;

    expect(hiddenInput).toBeTruthy();

    expect(JSON.parse(hiddenInput.value)).toEqual([
      {
        url: "https://ufs.sh/f/existing",
        key: "existing",
      },
    ]);

    expect(screen.getByAltText("تصویر ملک")).toBeInTheDocument();

    expect(screen.getByText("1 از 2 تصویر")).toBeInTheDocument();
  });

  it("should remove an uploaded image", async () => {
    renderForm();

    fireEvent.click(screen.getByTestId("mock-upload"));

    await waitFor(() => {
      expect(screen.getByText("1 از 2 تصویر")).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "حذف",
      }),
    );

    await waitFor(() => {
      const input = document.querySelector(
        'input[name="images"]',
      ) as HTMLInputElement;

      expect(JSON.parse(input.value)).toEqual([]);

      expect(screen.getByText("0 از 2 تصویر")).toBeInTheDocument();
    });

    expect(screen.queryByAltText("تصویر ملک")).not.toBeInTheDocument();
  });

  it("should show upload error", () => {
    const { action } = renderForm();

    fireEvent.click(screen.getByTestId("mock-upload-error"));

    expect(action).not.toHaveBeenCalled();
  });

  it("should contain uploaded images in form data", async () => {
    renderForm();

    fireEvent.click(screen.getByTestId("mock-upload"));

    await waitFor(() => {
      expect(screen.getByText("1 از 2 تصویر")).toBeInTheDocument();
    });

    const form = screen
      .getByRole("button", {
        name: "ثبت آگهی",
      })
      .closest("form");

    expect(form).toBeTruthy();

    const hiddenInput = form!.querySelector(
      'input[name="images"]',
    ) as HTMLInputElement;

    expect(hiddenInput).toBeTruthy();

    expect(hiddenInput.value).toBe(
      JSON.stringify([
        {
          url: "https://ufs.sh/f/image-1",
          key: "image-1",
        },
      ]),
    );
  });

  it("should keep multiple uploaded images", async () => {
    renderForm();

    fireEvent.click(screen.getByTestId("mock-upload"));

    await waitFor(() => {
      expect(screen.getByText("1 از 2 تصویر")).toBeInTheDocument();
    });

    const hiddenInput = document.querySelector(
      'input[name="images"]',
    ) as HTMLInputElement;

    expect(JSON.parse(hiddenInput.value)).toHaveLength(1);

    expect(screen.getByAltText("تصویر ملک")).toBeInTheDocument();
  });
});
