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

export interface AdActionState {
  success: boolean;
  message?: string;
  errors?: Partial<Record<keyof Ad, string>>;
}

export interface CreateAdFormProps {
  initialData?: Partial<Ad>;
  categories: string[];
  action: (
    state: AdActionState,
    formData: FormData
  ) => Promise<AdActionState>;
  isEditing?: boolean;
}