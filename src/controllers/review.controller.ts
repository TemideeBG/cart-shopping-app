import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { OrderService } from "../services/order.service";
import { ReviewService } from "../services/review.service";

export class ReviewController {
    public reviewService = new ReviewService();

    public addNewReview = async (req:Request, res:Response, next:NextFunction) => {
            const reviewData = req.body;
            const newReview = await this.reviewService.createReview(reviewData, req);
            return res.status(StatusCodes.CREATED).json({ data: newReview, message: 'successfully created a new review' });   
    };

    public findReviewById = async (req:Request, res:Response, next:NextFunction) => {
            const review = await this.reviewService.getSingleReview(+req.params.review_id, req);
            return res.status(StatusCodes.OK).json({ data: review, message: 'successfully retrieved review details' });          
    };

    public findCurrentUserReviews = async (req:Request, res:Response, next:NextFunction) => {
            const reviews = await this.reviewService.getCurrentUserReviews(req);
            return res.status(StatusCodes.OK).json({ data: reviews, message: 'successfully retrieved review details particular to owner' });          
    };

    public findReviewsByProductId = async (req:Request, res:Response, next:NextFunction) => {
        const reviews = await this.reviewService.getReviewsByProductId(+req.params.product_id, req);
        return res.status(StatusCodes.OK).json({ data: reviews, message: `successfully retrieved review details particular to product with id: ${+req.params.product_id}` });          
};

    public findAllReviews = async (req:Request, res:Response, next:NextFunction) => {
            const queryStry = req.query;
            const reviews = await this.reviewService.getAll(queryStry, req);
            return res.status(StatusCodes.OK).json({ data: reviews, message: 'successfully retrieved all review details' });     
    };

    public deleteReview = async (req:Request, res:Response, next:NextFunction) => {
            const review = await this.reviewService.delete(+req.params.review_id, req);
            return res.status(StatusCodes.OK).json({ data: review });         
    };

};