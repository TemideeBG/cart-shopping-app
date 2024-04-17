import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import { authentication, authorizeRoles, checkBlackist } from '../middleware/auth.middleware';
import { ReviewController } from '../controllers/review.controller';

class ReviewRoute implements Routes {
  public path = '/review';
  public router = Router();
  public reviewController = new ReviewController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authentication, checkBlackist, this.reviewController.addNewReview);
    this.router.get(`${this.path}/:review_id`, authentication, checkBlackist, this.reviewController.findReviewById);
    this.router.get(`${this.path}`, authentication, checkBlackist, this.reviewController.findCurrentUserReviews);
    this.router.get(`${this.path}/all/reviews/:product_id`, checkBlackist, authentication, this.reviewController.findReviewsByProductId);
    this.router.get(`${this.path}/all/reviews`, authentication, checkBlackist, this.reviewController.findAllReviews);
    this.router.delete(`${this.path}/:review_id`, authentication, checkBlackist, this.reviewController.deleteReview);
  }
}

export default ReviewRoute;
