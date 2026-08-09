"use client";

import { FiPlus, FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DynamicStringListProps {
  label: string;
  name: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  addButtonText?: string;
  emptyText?: string;
  disabled?: boolean;
}

export default function DynamicStringList({
  label,
  name,
  values,
  onChange,
  placeholder = "مقدار را وارد کنید",
  addButtonText = "افزودن",
  emptyText = "موردی اضافه نشده است.",
  disabled = false,
}: DynamicStringListProps) {
  const addItem = () => {
    onChange([...values, ""]);
  };

  const updateItem = (
    index: number,
    value: string
  ) => {
    const newValues = [...values];

    newValues[index] = value;

    onChange(newValues);
  };

  const removeItem = (index: number) => {
    onChange(
      values.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Label>{label}</Label>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          disabled={disabled}
        >
          <FiPlus />
          {addButtonText}
        </Button>
      </div>

      {values.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          {emptyText}
        </div>
      ) : (
        <div className="space-y-3">
          {values.map((value, index) => (
            <div
              key={index}
              className="flex items-center gap-2"
            >
              <Input
                name={name}
                value={value}
                onChange={(event) =>
                  updateItem(
                    index,
                    event.target.value
                  )
                }
                placeholder={placeholder}
                disabled={disabled}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
                disabled={disabled}
                aria-label={`حذف ${label}`}
              >
                <FiTrash2 />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}