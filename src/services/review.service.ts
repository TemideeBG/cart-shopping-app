import { AppDataSource } from "../database/data-source";
import { User } from "../interfaces/user.interface";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../exceptions/HttpException";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { UserService } from "./user.service";
import { ProductService } from "./product.service";
import { ProductEntity } from "../entity/product.entity";
import { ReviewEntity } from "../entity/review.entity";
import { CreateReviewDto } from "../dto/review.dto";
import { ReviewInterface } from "../interfaces/review.interface";
import { SelectQueryBuilder } from "typeorm";
import { ApiFeatures } from "../utils/api-feature";


export class ReviewService  {
    public reviews = ReviewEntity;
    public userService = new UserService();
    public productService = new ProductService();
    public reviewRepository = AppDataSource.getRepository(this.reviews);

    public async createReview(createReviewDto:CreateReviewDto, req:AuthenticatedRequest) : Promise<ReviewInterface> {
        createReviewDto.userId = req.user.id;
        const findUser:User = await this.userService.findById(createReviewDto.userId,req);
        if(!findUser) throw new HttpException(StatusCodes.NOT_FOUND, `User with id:${createReviewDto.userId} not found`);

        const findProduct:ProductEntity = await this.productService.getSingleProduct(createReviewDto.productId);
        if(!findProduct) throw new HttpException(StatusCodes.NOT_FOUND, `Product with id:${createReviewDto.productId} not found`);

        createReviewDto.productId = findProduct.id;
        req.body.user = req.user;
        const review = new ReviewEntity();
        Object.assign(review, createReviewDto);
        review.product = findProduct;
        
        const savedReview = await this.reviewRepository.save(review);
        const updatedProduct = await this.productService.calculateAverageRating(findProduct.id);

        console.log(savedReview, updatedProduct);
        return savedReview; 
    };

    
    public async getSingleReview(id: number, req: AuthenticatedRequest): Promise<ReviewInterface> {
        const review = await this.reviewRepository
            .createQueryBuilder("review")
            .leftJoinAndSelect("review.user", "user")
            .leftJoinAndSelect("review.product", "product")
            .select(["review", "user.id", "user.full_name", "user.email", "user.home_address", "user.city", "product.name", "product.price", "product.description", "product.category", "product.company"])
            .where("review.id = :id", { id })
            .getOne();
    
        if (!review)  throw new HttpException(StatusCodes.NOT_FOUND, `Review with id:${id} not found`);
        return review;
    };

    
    public async getCurrentUserReviews(req: AuthenticatedRequest): Promise<ReviewInterface[]> {
        const reviews = await this.reviewRepository
            .createQueryBuilder("review")
            .leftJoinAndSelect("review.user", "user")
            .leftJoinAndSelect("review.product", "product")
            .select(["review", "user.full_name", "user.email", "user.home_address", "user.city", "product.name", "product.price", "product.description", "product.category", "product.company"])
            .where("user.id = :userId", { userId: req.user.id })
            .getMany();
    
        if (!reviews || reviews.length === 0) throw new HttpException(StatusCodes.NOT_FOUND, `No reviews found for user with id:${req.user.id}`);
        return reviews;
    };

    public async getReviewsByProductId(productId: number, req: AuthenticatedRequest): Promise<ReviewInterface[]> {
        const reviews = await this.reviewRepository
            .createQueryBuilder("review")
            .leftJoinAndSelect("review.user", "user")
            .leftJoinAndSelect("review.product", "product")
            .select(["review", "user.full_name", "user.email", "user.home_address", "user.city", "product.id", "product.name", "product.price", "product.description", "product.category", "product.company"])
            .where("product.id = :productId", { productId })
            .getMany();
    
        if (!reviews || reviews.length === 0) throw new HttpException(StatusCodes.NOT_FOUND, `No reviews were found for the product with id:${productId}`);
        return reviews;
    };
    

    public async getAll(queryStr: any, req: AuthenticatedRequest): Promise<any> {
        const totalReviewCount = await this.reviewRepository.count();
        const resultPerPage = parseInt(String(req.query.limit)) || totalReviewCount;
        const page = parseInt(String(req.query.page)) || 1;

      
        const query: SelectQueryBuilder<ReviewEntity> = this.reviewRepository
          .createQueryBuilder("review")
          .leftJoinAndSelect("review.user", "user")
          .leftJoinAndSelect("review.product", "product")
          .select(["review", "user.full_name", 'user.email', "user.email", "user.home_address", "user.city",  "product.name", "product.price", "product.description", "product.category", "product.company"]);
      
        const apiFeatures = new ApiFeatures<ReviewEntity>(query, queryStr);
      
        apiFeatures.search().filter().pagination(resultPerPage);
      
        const reviews = await apiFeatures.executeQuery();
      
        const filteredReviewCount = reviews.length;
      
        if (reviews.length === 0) {
          throw new HttpException(StatusCodes.NOT_FOUND, 'No Reviews found', );
        };
      
        return {
          data: reviews,
          totalReviewCount,
          filteredReviewCount,
          page,
          resultPerPage,
        };
      };

      /*
    async updateCart(cartId: string, updateCartDto: UpdateCartDto, req:AuthenticatedRequest) : Promise<CartInterface> {
        const { quantity, productId } = updateCartDto ;
        let isvalidProduct:ProductInterface = await this.productService.getSingleProduct(productId);
        if(!isvalidProduct) throw new HttpException(StatusCodes.NOT_FOUND, `Product with id:${productId} not found`);

        let cartToUpdate = await this.cartRepository.findOne({ where: { id:cartId }, relations: ["user","product"] });
        if (!cartToUpdate) {
          throw new  HttpException(StatusCodes.NOT_FOUND, `cart with id:${cartId} not found`);
        };
        const availableProducts = isvalidProduct.num_of_products_created - isvalidProduct.num_of_products_requested;
        if(quantity > availableProducts) throw new BadRequestError(`Movies requested for, exceeds the stock available which is ${availableProducts}!!`);
        const hasAdminRole = req.user?.role.includes('admin') || req.user?.role.includes('super-admin');
        console.log(cartToUpdate.user.id, req.user.id, hasAdminRole);
        if (cartToUpdate.user.id !== req.user.id && !hasAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to update cart details!!'); 
    
        // Update the product's properties with provided data from updateProductDto
        Object.assign(cartToUpdate, updateCartDto);
       
        const updatedProduct = await this.productService.updateNumberOfProductsReqAfterCartUpdate(isvalidProduct.id, isvalidProduct.num_of_products_requested, cartToUpdate.quantity, quantity);
        console.log(cartToUpdate.quantity, quantity);
        const newCartToUpdate = await this.cartRepository.save(cartToUpdate);
        console.log(newCartToUpdate,updatedProduct);
        return newCartToUpdate;
      };
      */

    async delete(reviewId:number, req:AuthenticatedRequest) {
        const userId = req.user.id;
        const findUser:User = await this.userService.findById(userId,req);
        if(!findUser) throw new HttpException(StatusCodes.NOT_FOUND, `User with id:${userId} not found`);
        const reviewToDelete = await this.reviewRepository.findOne({ where: { id:reviewId }, relations: ["user","product"] });
        if (!reviewToDelete) {
          throw new HttpException(StatusCodes.NOT_FOUND, `Review with ID ${reviewId} not found`);
        };
        const hasAdminRole = req.user?.role.includes('admin') || req.user?.role.includes('super-admin');
        console.log(reviewToDelete.user.id, req.user.id, hasAdminRole);
        if (reviewToDelete.user.id !== req.user.id && !hasAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to delete this review!!');
        const updatedProduct = await this.productService.calculateAverageRating(reviewToDelete.product.id);
        await this.reviewRepository.remove(reviewToDelete);
        return { msg: `Review placed by: ${findUser.first_name} has been Successfully Deleted` };
      };

}



