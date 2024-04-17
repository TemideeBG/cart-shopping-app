import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { OrderService } from "../services/order.service";

export class OrderController {
    public orderService = new OrderService();

    public addNewOrder = async (req:Request, res:Response, next:NextFunction) => {
            const orderData = req.body;
            const newOrder = await this.orderService.newOrder(orderData, req);
            return res.status(StatusCodes.CREATED).json({ data: newOrder, message: 'successfully created a new order' });   
    };

    public findOrderById = async (req:Request, res:Response, next:NextFunction) => {
            const order = await this.orderService.getSingleOrder(req.params.order_id, req);
            return res.status(StatusCodes.OK).json({ data: order, message: 'successfully retrieved order details' });          
    };

    public findUserOrder = async (req:Request, res:Response, next:NextFunction) => {
            const orders = await this.orderService.getCurrentOrderUser(req);
            return res.status(StatusCodes.OK).json({ data: orders, message: 'successfully retrieved order details particular to owner' });          
    };

    public findAllOrders = async (req:Request, res:Response, next:NextFunction) => {
            const queryStry = req.query;
            const orders = await this.orderService.getAll(queryStry, req);
            return res.status(StatusCodes.OK).json({ data: orders, message: 'successfully retrieved all order details' });     
    };

    
    public approveOrder = async (req:Request, res:Response, next:NextFunction) => {
        const order = await this.orderService.approveOrder(req.params.order_id, req)
        return res.status(StatusCodes.OK).json({ data: order, message: 'successfully approved order details' });    
    };


    public deleteOrder = async (req:Request, res:Response, next:NextFunction) => {
            const order = await this.orderService.delete(req.params.order_id, req);
            return res.status(StatusCodes.OK).json({ data: order });         
    };

};