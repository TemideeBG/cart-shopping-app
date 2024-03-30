import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../interfaces/user.interface";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../exceptions/HttpException";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { ProductEntity } from "../entity/product.entity";
import { UserService } from "./user.service";
import { ProductInterface } from "../interfaces/product.interface";
import { CreateProductDto } from "../dto/product.dto";
import { generateInvoiceNumber } from "../utils/util";
import { UpdateProductDto } from "../dto/update-product.dto";


export class ProductService  {
    public products = ProductEntity;
    public userService = new UserService();
    public productRepository = AppDataSource.getRepository(this.products);

    public async createProduct(createProductDto:CreateProductDto, req:AuthenticatedRequest) : Promise<ProductInterface> {
        const userId = req.user.id;
        const findUser:User = await this.userService.findById(userId,req);
        if(!findUser) throw new HttpException(StatusCodes.NOT_FOUND, `User with id:${userId} not found`);
        
        const product = new ProductEntity();
        Object.assign(product, createProductDto);
        product.inventory_number = generateInvoiceNumber();
        console.log(createProductDto.currency);
        product.amount = `${product.currency}${product.price}`;
    
        const savedProduct = await this.productRepository.save(product);
        return savedProduct;
    }

  /* 
    public async getSingleProduct(id:number) {
        const product = await this.productRepository.findOne({ where: { id: id }, relations: ["carts"] });
        if(!product) throw new HttpException(StatusCodes.NOT_FOUND, `Product with id:${id} not found`);
        return product;
    };

    public async getAllProducts()  {
        const allProducts = await this.productRepository.find({ relations: ["carts"] });
        if(!allProducts || allProducts.length === 0) throw new HttpException(StatusCodes.NOT_FOUND, `No product was found`);
        return allProducts;
    };
    
  */

    public async getSingleProduct(id:number) : Promise<ProductEntity> {
      const product = await this.productRepository.findOne({ where: { id: id }, relations: ["carts"] });
      if(!product) throw new HttpException(StatusCodes.NOT_FOUND, `Product with id:${id} not found`);
      
      product.num_of_products_requested = this.calculateProductsRequested(product);
      console.log(product)
      return product;
  };

    public async getAllProducts() {
      const allProducts = await this.productRepository.find({ relations: ["carts"] });
        if(!allProducts || allProducts.length === 0) throw new HttpException(StatusCodes.NOT_FOUND, `No product was found`);
        allProducts.forEach(product => {
          product.num_of_products_requested = this.calculateProductsRequested(product);
        });
        return allProducts;
  };
  

    public async updateProduct(productId: number, updateProductDto: UpdateProductDto, req:AuthenticatedRequest) : Promise<ProductInterface> {
        let productToUpdate = await this.productRepository.findOne({ where: { id:productId } });
    
        if (!productToUpdate) {
          throw new  HttpException(StatusCodes.NOT_FOUND, `Product with id:${productId} not found`);
        };
    
        // Update the product's properties with provided data from updateProductDto
        Object.assign(productToUpdate, updateProductDto);
       
        const newProductToUpdate = await this.productRepository.save(productToUpdate);
  
        return newProductToUpdate;
      };

    public async delete(productId: number, req:AuthenticatedRequest) {
        const userId = req.user.id;
        const findUser:User = await this.userService.findById(userId,req);
        if(!findUser) throw new HttpException(StatusCodes.NOT_FOUND, `User with id:${userId} not found`);
        const productToDelete = await this.productRepository.findOne({ where: { id:productId } });
        if (!productToDelete) {
          throw new HttpException(StatusCodes.NOT_FOUND, `Product with ID ${productId} not found`);
        };
  
        await this.productRepository.remove(productToDelete);
        return { msg: `Product: ${productToDelete.name} Successfully Deleted` };
      };

      private calculateProductsRequested(product: ProductEntity): number {
        return product.carts.reduce((total, cart) => total + cart.quantity, 0);
      }


}

