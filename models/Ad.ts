import { Schema, model, models, type InferSchemaType } from "mongoose";

const adSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    agency: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      required: true,
      enum: ["vila", "apartment", "land", "shop", "office"],
    },

    transactionType: {
      type: String,
      enum: ["buy", "rent"],
      required: true,
    },

    price: {
      type: Number,
      min: 0,
      default: 0,
    },

    deposit: {
      type: Number,
      min: 0,
      default: 0,
    },

    rent: {
      type: Number,
      min: 0,
      default: 0,
    },

    area: {
      type: Number,
      required: true,
      min: 0,
    },

    amenities: {
      type: [String],
      default: [],
    },

    rules: {
      type: [String],
      default: [],
    },

    constructionDate: {
      type: String,
      default: "",
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export type AdDocument = InferSchemaType<typeof adSchema>;

export const Ad = models.Ad || model<AdDocument>("Ad", adSchema);
