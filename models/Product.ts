import mongoose, { Schema, models, model } from "mongoose";

const storePriceSchema = new Schema(
  {
    storeId: { type: Schema.Types.ObjectId, ref: "Store" },
    storeName: { type: String, required: true },
    productTitle: String,
    productUrl: {
      type: String,
      required: function () {
        return this.storeName !== "MyPetAI Shop";
      },
    },
    productImageUrl: {
      type: String,
      required: function () {
        return this.storeName !== "MyPetAI Shop";
      },
    },
    regularPrice: { type: Number, default: null },
    memberPrice: { type: Number, default: null },
    repeatPrice: { type: Number, default: null },
    lastUpdated: { type: Date, default: Date.now },
  },
  { _id: false }
);

storePriceSchema.index({ storeName: 1, lastUpdated: -1 });

// 🧩 Updated Product Schema
const productSchema = new Schema(
  {
    name: { type: String, required: true, index: true },

    species: {
      type: [{ type: String, enum: ["dog", "cat", "fish", "bird", "small-animal", "reptile", "other"] }],
      default: ["dog"],
      index: true,
    },

    categories: {
      type: [String],
      index: true,
      default: [],
    },

    breedCompatibility: { type: [String], index: true },

    description: String,
    weightKg: Number,

    // ✅ New unified field
    digitalAssets: [
      {
        url: { type: String, required: true },
        type: {
          type: String,
          enum: ["image", "video"],
          default: "image",
        },
      },
    ],

    // 🧩 (Deprecated) Keep for backward compatibility, optional
    imageUrl: { type: String, select: false },

    nutrition: {
      protein: Number,
      fat: Number,
      fiber: Number,
    },
    barcode: String,
    sku: String,
    productCode: String,
    averagePrice: { type: Number, default: null },
    lastChecked: Date,
    storesAvailable: [{ type: Schema.Types.ObjectId, ref: "Store" }],
    stores: [storePriceSchema],
    isActive: { type: Boolean, default: true },
    updatedBy: { type: String, index: true },
  },
  { timestamps: true }
);

productSchema.index({ species: 1, categories: 1 });
productSchema.index({ species: 1, "breedCompatibility": 1 });
productSchema.index({ name: "text", description: "text" });

export type DigitalAsset = {
  url: string;
  type?: "image" | "video";
};

export type StorePrice = {
  storeId: string;
  storeName: string;
  productTitle?: string;
  productUrl: string;
  productImageUrl: string;
  regularPrice?: number | null;
  memberPrice?: number | null;
  repeatPrice?: number | null;
  lastUpdated?: string;
};

export type ProductDoc = {
  _id: string;
  name: string;
  species: string[];
  categories: string[];
  breedCompatibility: string[];
  description?: string;
  weightKg?: number;

  // ✅ New field
  digitalAssets?: DigitalAsset[];

  // (Deprecated)
  imageUrl?: string;

  nutrition?: { protein?: number; fat?: number; fiber?: number };
  barcode?: string;
  sku?: string;
  productCode?: string;
  averagePrice?: number;
  lastChecked?: string;
  storesAvailable?: string[];
  stores: StorePrice[];
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string;
};



export default (models.Product as mongoose.Model<ProductDoc>) ||
  model<ProductDoc>("Product", productSchema);
