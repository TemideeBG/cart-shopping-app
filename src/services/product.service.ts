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
import { SelectQueryBuilder } from "typeorm";
import { ApiFeatures } from "../utils/api-feature";


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
    };

    public async getSingleProduct(id:number) : Promise<ProductEntity> {
      const product = await this.productRepository.findOne({ where: { id: id } });
      if(!product) throw new HttpException(StatusCodes.NOT_FOUND, `Product with id:${id} not found`);
      console.log(product)
      return product;
  };

  public async getAll(queryStr: any, req: AuthenticatedRequest): Promise<any> {
    const totalProductCount = await this.productRepository.count();
    const resultPerPage = parseInt(String(req.query.limit)) || totalProductCount;
    const page = parseInt(String(req.query.page)) || 1;

  
    const query: SelectQueryBuilder<ProductEntity> = this.productRepository.createQueryBuilder("product")
  
    const apiFeatures = new ApiFeatures<ProductEntity>(query, queryStr);
  
    apiFeatures.search().filter().pagination(resultPerPage);
  
    const products = await apiFeatures.executeQuery();
  
    const filteredProductCount = products.length;
  
    if (products.length === 0) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'No Products found', );
    };
  
    return {
      data: products,
      totalProductCount,
      filteredProductCount,
      page,
      resultPerPage,
    };
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

    public async updateNumberOfProductsReqAfterCartAddition(productId:number, initialValue:number, quantity:number) {
        const product = await this.productRepository.update(productId, { num_of_products_requested: initialValue + quantity });
        if(!product) throw new HttpException(StatusCodes.NOT_FOUND, `Product with id:${productId} not found`);
        console.log(product)
        return product;
    };

    public async updateNumberOfProductsReqAfterCartUpdate(productId: number, currentProdQuantity:number, prevCartQuantity: number, newCartQuantity: number) {
        const difference = newCartQuantity - prevCartQuantity;
        console.log(difference);
        const product = await this.productRepository.update(productId, { num_of_products_requested: currentProdQuantity + difference });
        if(!product) throw new HttpException(StatusCodes.NOT_FOUND, `Product with id:${productId} not found`);
        console.log(product)
        return product;
    };

    public async updateNumberOfProductsReqAfterCartRemoval(productId:number, currentValue:number, quantity:number) {
      const product = await this.productRepository.update(productId, { num_of_products_requested: currentValue - quantity });
      if(!product) throw new HttpException(StatusCodes.NOT_FOUND, `Product with id:${productId} not found`);
      console.log(product)
      return product;
  };

    public async calculateAverageRating(productId: number): Promise<void> {
      const result = await this.productRepository
        .createQueryBuilder('product')
        .select('AVG(review.rating)', 'average_rating')
        .addSelect("COUNT(review.id)", "num_of_reviews")
        .leftJoin('product.reviews', 'review')
        .where('product.id = :productId', { productId })
        .getRawOne();

    const average_rating = Math.ceil(result?.average_rating) || 0;
    const num_of_reviews = result?.num_of_reviews || 0;

    await this.productRepository.update(productId, { average_rating, num_of_reviews });
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
};






/*
      private calculateProductsRequested(product: ProductEntity): number {
        return product.carts.reduce((total, cart) => total + cart.quantity, 0);
      }
    */
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