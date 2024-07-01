import asyncHandler from 'express-async-handler';
import { RequestHandler } from "express";
import ProductBrand from '../models/ProductBrand';
import Product from '../models/Product';

const createBrand: RequestHandler = asyncHandler(async (req: any, res: any): Promise<any> => {
    try {
        const { brand_name } = req.body;
        console.log('brand', brand_name)
        const existingBrand = await ProductBrand.findOne({ brand_name });
        if(existingBrand) {
            res.status(400).json('Brand already exist');
        }
        const newBrand = new ProductBrand({ brand_name });
        await newBrand.save();
        return res.status(200).json({ message: 'create brand successfully', brand: newBrand});
    } catch (error) {
        console.log(error);
        return res.status(500).json('Internal server error');
    }
});

const getAllBrand: RequestHandler = asyncHandler(async (req: any, res: any): Promise<any> => {
    try {
        const brands = await ProductBrand.find();  
        res.status(200).json(brands);
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error');
    }
});

const getBrandById: RequestHandler = asyncHandler(async (req: any, res: any): Promise<any> => {
    try {
        const brand = await ProductBrand.findById(req.params.brandId);
        if(!brand) {
            res.status(404).json('Brand not found');
        }
        res.status(200).json(brand);
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error');
    }
});

const updateBrand: RequestHandler = asyncHandler(async (req: any, res: any): Promise<any> => {
    try {
        const { brand_name } = req.body;
        const updateBrand = await ProductBrand.findByIdAndUpdate(
            req.params.brandId,
            { brand_name },
            { new: true }
        )
        if(!updateBrand) {
            res.status(404).json('Brand not found');
        }
        res.status(200).json({ message: 'Update brand successfully', brand: updateBrand});
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error');
    }
});

const deleteBrand: RequestHandler = asyncHandler(async (req: any, res: any): Promise<any> => {
    try {
        const products = await Product.find({ product_brand_id: req.params.brandId });
        if (products.length > 0) {
            return res.status(400).json({ message: 'Cannot delete brand with existing products' });
        }
        const deleteBrand = await ProductBrand.findByIdAndDelete(req.params.brandId);
        if(!deleteBrand) {
            res.status(404).json('Brand not found');
        }
        res.status(200).json('Delete brand successfully');
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error');
    }
});

const brandController = { createBrand, getAllBrand, getBrandById, updateBrand, deleteBrand };

export default brandController;