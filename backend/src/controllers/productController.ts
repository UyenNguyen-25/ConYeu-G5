import asyncHandler from "express-async-handler";
import e, { RequestHandler } from "express";
import ProductStatus from "../models/ProductStatus";
import Product from "../models/Product";
import ProductBrand from "../models/ProductBrand";

const autoCreateStatus: RequestHandler = asyncHandler(
  async (req: any, res: any): Promise<any> => {
    try {
      const statuses = ["inStock", "outStock", "promotion"];

      for (const item of statuses) {
        await ProductStatus.create({
          product_status_description: item,
        });
      }

      res.status(200).json("auto create product status successfullly");
    } catch (error) {
      console.log(error);
      res.status(500).json("Internal server error.");
    }
  }
);

const getProductStatus: RequestHandler = asyncHandler(
  async (req: any, res: any): Promise<any> => {
    try {
      const statuses = await ProductStatus.find();
      if (!statuses?.length) {
        return res.status(400).json({ message: "No product status found" });
      }
      res.status(200).json(statuses);
    } catch (error) {
      console.log(error);
      res.status(500).json("Internal server error.");
    }
  }
);

const createNewProduct: RequestHandler = asyncHandler(
  async (req: any, res: any): Promise<any> => {
    try {
      const {
        product_name,
        product_type,
        product_brand_id,
        product_age,
        product_price,
        product_price_discount,
        product_img,
        quantity,
        product_description,
        product_status,
      } = req.body;

      const existingBrand = await ProductBrand.findById(product_brand_id);
      if (!existingBrand) {
        return res.status(400).json({ message: "Brand does not exist" });
      }
      const newProduct = new Product({
        product_name,
        product_type,
        product_brand_id,
        product_age,
        product_price,
        product_price_discount,
        product_img,
        quantity,
        product_description,
        product_status,
      });

      await newProduct.save();
      res
        .status(200)
        .json({ message: "Create product successfully", data: newProduct });
    } catch (error) {
      console.log(error);
      res.status(500).json("Internal server error.");
    }
  }
);

//check_duplicate_product_name
const duplicate_product_name: RequestHandler = asyncHandler(
  async (req, res): Promise<any> => {
    try {
      const duplicate = await Product.findOne({
        product_name: req.body.product_name,
      })
        .lean()
        .exec();

      if (duplicate) {
        return res
          .status(400)
          .json({ message: "Product name is already exited" });
      } else
        return res.status(200).json({ message: "Product name is available" });
    } catch (error) {
      console.log(error);
      res.status(500).json("Internal server error.");
    }
  }
);

//update
const update_product: RequestHandler = asyncHandler(
  async (req, res): Promise<any> => {
    try {
      const { product_id } = req.params;
      const {
        product_name,
        product_type,
        product_brand_id,
        product_age,
        product_price,
        product_price_discount,
        product_img,
        quantity,
        product_description,
        product_status,
      } = req.body;

      const existingProduct = await Product.findById(product_id)
        .populate("product_brand_id")
        .exec();
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      } else {
        existingProduct.product_name = product_name;
        existingProduct.product_type = product_type;
        existingProduct.product_brand_id = product_brand_id;
        existingProduct.product_age = product_age;
        existingProduct.product_price = product_price;
        existingProduct.product_price_discount = product_price_discount;
        existingProduct.product_img = product_img;
        existingProduct.quantity = quantity;
        existingProduct.product_description = product_description;
        existingProduct.product_status = product_status;

        await existingProduct.save();
        const result = await Product.findById(product_id)
          .populate("product_brand_id", "brand_name -_id", "", "")
          .populate("product_status", "product_status_description -_id")
          .exec();
        res.status(200).json({
          message: `Product ${result?._id} update susscesfully!!!`,
          Product: result,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

//delete
const delete_product: RequestHandler = asyncHandler(
  async (req, res): Promise<any> => {
    const { product_id } = req.params;

    if (!product_id) {
      return res.status(400).json({ message: "Product ID required" });
    }

    const deletedProduct = await Product.findOneAndDelete({ _id: product_id })
      .lean()
      .exec();
    if (deletedProduct) {
      res
        .status(200)
        .json({ message: `${deletedProduct?.product_name} deleted success` });
    } else {
      return res.status(400).json({ message: "Product not found" });
    }
  }
);

//get_all_product
const get_all_product: RequestHandler = asyncHandler(
  async (req, res): Promise<any> => {
    const product = await Product.find({})
      .populate("product_brand_id", "brand_name _id", "", "")
      .populate("product_status", "product_status_description _id")
      .lean();
    if (!product?.length) {
      return res.status(400).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  }
);

//get_product_by_id
const get_product_by_id: RequestHandler = asyncHandler(
  async (req, res): Promise<any> => {
    const { product_id } = req.params;

    if (!product_id) {
      return res.status(400).json({ message: "Product ID required" });
    }

    const product = await Product.findOne({ _id: product_id })
      .populate("product_brand_id", "brand_name -_id", "", "")
      .populate("product_status", "product_status_description -_id")
      // .populate("feedback_id", "feedback_rating feedback_description -_id")
      .populate({
        path: "feedback_id",
        select: "feedback_rating feedback_description createdAt",
      })
      .lean()
      .exec();
    if (product) {
      res.status(200).json({ message: `Product: ${product?._id}`, product });
    } else {
      return res.status(400).json({ message: "Product not found" });
    }
  }
);

const productController = {
  createNewProduct,
  autoCreateStatus,
  duplicate_product_name,
  update_product,
  delete_product,
  get_all_product,
  get_product_by_id,
  getProductStatus,
};

export default productController;