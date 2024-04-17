import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ProductService } from "../services/product.service";

export class ProductController {
    public productService = new ProductService();

    public addNewProduct = async (req:Request, res:Response, next:NextFunction) => {
            const productData = req.body;
            const newProduct = await this.productService.createProduct(productData,req);
            return res.status(StatusCodes.CREATED).json({ data: newProduct, message: 'successfully created a new product' });   
    };

    public findProductById = async (req:Request, res:Response, next:NextFunction) => {
            const product = await this.productService.getSingleProduct(+req.params.product_id);
            return res.status(StatusCodes.OK).json({ data: product, message: 'successfully retrieved product details' });          
    };

    public findAllProducts = async (req:Request, res:Response, next:NextFunction) => {
            const queryStry = req.query;
            const products = await this.productService.getAll(queryStry,req);
            return res.status(StatusCodes.OK).json({ data: products, message: 'successfully retrieved all product details' });     
    };

    public updateProduct = async (req:Request, res:Response, next:NextFunction) => {
        const productData = req.body;
        const product = await this.productService.updateProduct(+req.params.product_id, productData, req)
        return res.status(StatusCodes.OK).json({ data: product, message: 'successfully updated product details' });    
};

    public deleteProduct = async (req:Request, res:Response, next:NextFunction) => {
            const product = await this.productService.delete(+req.params.product_id, req);
            return res.status(StatusCodes.OK).json({ message: 'successfully deleted product' });         
    };


}