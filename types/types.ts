export type User = {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
};

export type TransactionType = "buy" | "rent";

export interface Ad {
  name: string;
  description: string;
  address: string;
  phone: string;
  agency: string;
  category: string;
  transactionType: TransactionType;

  price: number;
  deposit: number;
  rent: number;

  area: number;

  amenities: string[];
  rules: string[];

  constructionDate: string;
}

export type AdActionState = {
  success: boolean;
  message?: string;
  data?: Ad;
  errors?: {
    name?: string;
    category?: string;
    phone?: string;
    description?: string;
    address?: string;
    transactionType?: string;
    area?: string;
    price?: string;
    deposit?: string;
    rent?: string;
    constructionDate?: string;
  };
};

export interface CategoryItem {
  key: string;
  name: string;
}

export interface CreateAdFormProps {
  initialData?: Partial<Ad>;
  categories: CategoryItem[];
  action: (
    state: AdActionState,
    formData: FormData,
  ) => Promise<AdActionState>;
  isEditing?: boolean;
}