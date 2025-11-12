import mongoose, { Schema, models, model } from "mongoose";
import slugify from "slugify";

/* ----------------------------- 🏪 Store Schema ----------------------------- */
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
    lastUpdatedLocal: { type: String }, // ✅ new local string field
  },
  { _id: false }
);

storePriceSchema.index({ storeName: 1, lastUpdated: -1 });

/* ----------------------------- 💬 Review Schema ---------------------------- */
export type Review = {
  userId?: string;
  name: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
};

const ReviewSchema = new Schema<Review>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);


/* ----------------------------- 🧩 Product Schema ---------------------------- */
const productSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    
    // 🆕 SEO Slug
    slug: { type: String, unique: true, index: true },

    species: {
      type: [{ type: String, enum: ["dog", "cat", "aquatic", "bird", "small-animal", "reptile", "other"] }],
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
    lastCheckedLocal: String, // ✅ new lastChecked local string field
    storesAvailable: [{ type: Schema.Types.ObjectId, ref: "Store" }],
    stores: [storePriceSchema],
    isActive: { type: Boolean, default: true },
    updatedBy: { type: String, index: true },
    reviews: [ReviewSchema],
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ species: 1, categories: 1 });
productSchema.index({ species: 1, "breedCompatibility": 1 });
productSchema.index({ name: "text", description: "text" });


/* ----------------------------- ⚙️ Auto Slug Logic ---------------------------- */
productSchema.pre("save", async function (next) {
  // Only generate if missing or name changed
  if (!this.isModified("name") && this.slug) return next();

  const baseSlug = slugify(this.name, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  // Ensure unique slug
  while (await mongoose.models.Product.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  this.slug = slug;
  next();
});

/* -------------------------- ⭐ Update Rating  ------------------------------ */
// Auto-calc before save
productSchema.methods.updateRating = function () {
  if (this.reviews.length > 0) {
    this.reviewCount = this.reviews.length;
    this.averageRating =
      this.reviews.reduce((acc: number, r : {rating:number}) => acc + r.rating, 0) / this.reviewCount;
  } else {
    this.reviewCount = 0;
    this.averageRating = 0;
  }
};

/* ----------------------------- 🧾 Type Definitions ---------------------------- */
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
  lastUpdated?: Date;
  lastUpdatedLocal?: string;
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
  lastChecked?: Date;
  lastCheckedLocal?: string;
  storesAvailable?: string[];
  stores: StorePrice[];
  isActive?: boolean;
  updatedBy?: string;

  /* ✅ Reviews */
  reviews: Review[];
  averageRating: number;
  reviewCount: number;

  createdAt?: string;
  updatedAt?: string;

  slug?:string;

  /* Method added by schema */
  updateRating?: () => void;
};


/* ----------------------------- ✅ Export Model ---------------------------- */
const Product = (models.Product as mongoose.Model<ProductDoc>) || model<ProductDoc>("Product", productSchema);

export default Product;  

//export default (models.Product as mongoose.Model<ProductDoc>) ||
 // model<ProductDoc>("Product", productSchema);
