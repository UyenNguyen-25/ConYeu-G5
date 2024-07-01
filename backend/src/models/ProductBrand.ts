import mongoose from "mongoose";

const ProductBrandSchema = new mongoose.Schema(
  {
    brand_name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ProductBrand = mongoose.model("ProductBrand", ProductBrandSchema);

export default ProductBrand;
