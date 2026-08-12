"use client";

import { useActionState, useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import type {
  Ad,
  AdActionState,
  CreateAdFormProps,
  TransactionType,
} from "@/types/types";

import DynamicStringList from "./dynamic-string-list";

const initialActionState: AdActionState = {
  success: false,
  errors: {},
};

const defaultData: Ad = {
  name: "",
  description: "",
  address: "",
  phone: "",
  agency: "",
  category: "",
  transactionType: "buy",

  price: 0,
  deposit: 0,
  rent: 0,

  area: 0,

  amenities: [],
  rules: [],

  constructionDate: "",
};

export default function CreateAdForm({
  initialData,
  categories,
  action,
  isEditing = false,
}: CreateAdFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialActionState,
  );

  useEffect(() => {
    if (!state.message) return;
  
    if (state.success) {
      toast.add({
        type: "success",
        description: state.message,
      })
    } else {
      toast.add({
        type: "error",
        description: state.message,
        priority: "high",
      })
    }
  }, [state.message, state.success]);
  
  const data = {
    ...defaultData,
    ...initialData,
  };

  const [transactionType, setTransactionType] = useState<TransactionType>(
    data.transactionType,
  );

  const [amenities, setAmenities] = useState<string[]>(data.amenities);

  const [rules, setRules] = useState<string[]>(data.rules);

  const [constructionDate, setConstructionDate] = useState(
    data.constructionDate,
  );

  

  return (
    <form action={formAction}>
      <Card className="ring-0">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">
            {isEditing ? "ویرایش آگهی" : "ثبت آگهی"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* اطلاعات اصلی */}
          <section className="space-y-5">
            <div>
              <h2 className="font-heading text-base font-semibold text-primary">
                اطلاعات اصلی
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                اطلاعات اولیه ملک را وارد کنید.
              </p>
            </div>

            <Separator />

            <div className="grid gap-5 md:grid-cols-2">
              {/* نام */}
              <div className="space-y-2">
                <Label htmlFor="name">نام</Label>

                <Input
                  id="name"
                  name="name"
                  defaultValue={data.name}
                  placeholder="مثلاً آپارتمان ۱۲۰ متری"
                />

                {state.errors?.name && (
                  <p className="text-sm text-destructive">
                    {state.errors.name}
                  </p>
                )}
              </div>

              {/* دسته بندی */}
              <div className="space-y-2">
                <Label htmlFor="category">دسته‌بندی</Label>

                <Select name="category" defaultValue={data.category}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.key} value={category.key}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {state.errors?.category && (
                  <p className="text-sm text-destructive">
                    {state.errors.category}
                  </p>
                )}
              </div>

              {/* شماره تماس */}
              <div className="space-y-2">
                <Label htmlFor="phone">شماره تماس</Label>

                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={data.phone}
                  placeholder="09123456789"
                  dir="ltr"
                />

                {state.errors?.phone && (
                  <p className="text-sm text-destructive">
                    {state.errors.phone}
                  </p>
                )}
              </div>

              {/* بنگاه */}
              <div className="space-y-2">
                <Label htmlFor="agency">بنگاه</Label>

                <Input
                  id="agency"
                  name="agency"
                  defaultValue={data.agency}
                  placeholder="نام بنگاه"
                />
              </div>
            </div>

            {/* توضیحات */}
            <div className="space-y-2">
              <Label htmlFor="description">توضیحات</Label>

              <Textarea
                id="description"
                name="description"
                defaultValue={data.description}
                placeholder="توضیحات کامل ملک..."
                className="min-h-32 resize-y"
              />

              {state.errors?.description && (
                <p className="text-sm text-destructive">
                  {state.errors.description}
                </p>
              )}
            </div>

            {/* آدرس */}
            <div className="space-y-2">
              <Label htmlFor="address">آدرس</Label>

              <Textarea
                id="address"
                name="address"
                defaultValue={data.address}
                placeholder="آدرس کامل ملک"
                className="min-h-24 resize-y"
              />

              {state.errors?.address && (
                <p className="text-sm text-destructive">
                  {state.errors.address}
                </p>
              )}
            </div>
          </section>

          {/* اطلاعات معامله */}
          <section className="space-y-5">
            <div>
              <h2 className="font-heading text-base font-semibold text-primary">
                اطلاعات معامله
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                نوع معامله و اطلاعات مالی ملک را وارد کنید.
              </p>
            </div>

            <Separator />

            <div className="grid gap-5 md:grid-cols-2">
              {/* نوع معامله */}
              <div className="space-y-2">
                <Label htmlFor="transactionType">نوع معامله</Label>

                <Select
                  name="transactionType"
                  value={transactionType}
                  onValueChange={(value) => {
                    const type = value as TransactionType;

                    setTransactionType(type);
                  }}
                >
                  <SelectTrigger id="transactionType">
                    <SelectValue placeholder="نوع معامله را انتخاب کنید">
                      {transactionType === "buy" ? "خرید" : "اجاره"}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="buy">خرید</SelectItem>

                    <SelectItem value="rent">اجاره</SelectItem>
                  </SelectContent>
                </Select>

                {state.errors?.transactionType && (
                  <p className="text-sm text-destructive">
                    {state.errors.transactionType}
                  </p>
                )}
              </div>

              {/* متراژ */}
              <div className="space-y-2">
                <Label htmlFor="area">متراژ</Label>

                <Input
                  id="area"
                  name="area"
                  type="number"
                  min={0}
                  defaultValue={data.area || ""}
                  placeholder="مثلاً ۱۲۰"
                />

                {state.errors?.area && (
                  <p className="text-sm text-destructive">
                    {state.errors.area}
                  </p>
                )}
              </div>
            </div>

            {/* خرید */}
            {transactionType === "buy" ? (
              <div className="space-y-2">
                <Label htmlFor="price">مبلغ</Label>

                <Input
                  id="price"
                  name="price"
                  type="number"
                  min={0}
                  defaultValue={data.price || ""}
                  placeholder="مبلغ به تومان"
                  inputMode="numeric"
                />

                {state.errors?.price && (
                  <p className="text-sm text-destructive">
                    {state.errors.price}
                  </p>
                )}
              </div>
            ) : (
              /* اجاره */
              <div className="grid gap-5 md:grid-cols-2">
                {/* ودیعه */}
                <div className="space-y-2">
                  <Label htmlFor="deposit">ودیعه</Label>

                  <Input
                    id="deposit"
                    name="deposit"
                    type="number"
                    min={0}
                    defaultValue={data.deposit || ""}
                    placeholder="مبلغ ودیعه"
                    inputMode="numeric"
                  />

                  {state.errors?.deposit && (
                    <p className="text-sm text-destructive">
                      {state.errors.deposit}
                    </p>
                  )}
                </div>

                {/* اجاره */}
                <div className="space-y-2">
                  <Label htmlFor="rent">اجاره ماهانه</Label>

                  <Input
                    id="rent"
                    name="rent"
                    type="number"
                    min={0}
                    defaultValue={data.rent || ""}
                    placeholder="مبلغ اجاره"
                    inputMode="numeric"
                  />

                  {state.errors?.rent && (
                    <p className="text-sm text-destructive">
                      {state.errors.rent}
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* امکانات */}
          <DynamicStringList
            label="امکانات رفاهی"
            name="amenities"
            values={amenities}
            onChange={setAmenities}
            placeholder="مثلاً پارکینگ"
            addButtonText="افزودن امکان"
            emptyText="هنوز امکاناتی اضافه نشده است."
          />

          {/* قوانین */}
          <DynamicStringList
            label="قوانین"
            name="rules"
            values={rules}
            onChange={setRules}
            placeholder="مثلاً حیوان خانگی ممنوع"
            addButtonText="افزودن قانون"
            emptyText="هنوز قانونی اضافه نشده است."
          />

          {/* مشخصات ملک */}
          <section className="space-y-5">
            <div>
              <h2 className="font-heading text-base font-semibold text-primary">
                مشخصات ملک
              </h2>
            </div>

            <Separator />

            {/* تاریخ ساخت */}
            <div className="max-w-sm space-y-2">
              <Label htmlFor="constructionDate">تاریخ ساخت</Label>

              <DatePicker
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                format="YYYY/MM/DD"
                value={constructionDate}
                onChange={(date: DateObject | null) => {
                  const value = date ? date.format("YYYY/MM/DD") : "";

                  setConstructionDate(value);
                }}
                inputClass="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />

              <input
                type="hidden"
                name="constructionDate"
                value={constructionDate}
              />

              {state.errors?.constructionDate && (
                <p className="text-sm text-destructive">
                  {state.errors.constructionDate}
                </p>
              )}
            </div>
          </section>



          {/* Submit */}
          <div className="flex justify-end border-t border-border pt-6">
            <Button type="submit" disabled={isPending} className="min-w-32">
              {isPending
                ? "در حال ذخیره..."
                : isEditing
                  ? "ذخیره تغییرات"
                  : "ثبت آگهی"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
