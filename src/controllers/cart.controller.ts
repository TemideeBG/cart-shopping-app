import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CartService } from "../services/cart.service";

export class CartController {
    public cartService = new CartService();

    public addNewCart = async (req:Request, res:Response, next:NextFunction) => {
            const cartData = req.body;
            const newCart = await this.cartService.createCart(cartData,req);
            return res.status(StatusCodes.CREATED).json({ data: newCart, message: 'successfully created a new cart' });   
    };

    public findCartById = async (req:Request, res:Response, next:NextFunction) => {
            const cart = await this.cartService.getSingleCart(req.params.cart_id, req);
            return res.status(StatusCodes.OK).json({ data: cart, message: 'successfully retrieved cart details' });          
    };

    public findUserCart = async (req:Request, res:Response, next:NextFunction) => {
        const carts = await this.cartService.getCurrentCartUser(req);
        return res.status(StatusCodes.OK).json({ data: carts, message: 'successfully retrieved cart details particular to owner' });          
    };

    public findAllCarts = async (req:Request, res:Response, next:NextFunction) => {
            const products = await this.cartService.getAllProducts();
            return res.status(StatusCodes.OK).json({ data: products, message: 'successfully retrieved all cart details' });     
    };

    
    public updateCart = async (req:Request, res:Response, next:NextFunction) => {
        const cartData = req.body;
        const cart = await this.cartService.updateCart(req.params.cart_id, cartData, req)
        return res.status(StatusCodes.OK).json({ data: cart, message: 'successfully updated cart details' });    
    };


    public deleteCart = async (req:Request, res:Response, next:NextFunction) => {
            const cart = await this.cartService.delete(req.params.cart_id, req);
            return res.status(StatusCodes.OK).json({ data: cart });         
    };

};