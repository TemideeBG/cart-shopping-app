// Utility function to calculate subtotal based on order items
export const calculateSubtotal = (orderItems: any[]): number => {
    let subtotal = 0;
    for (const item of orderItems) {
        subtotal += item.price * item.quantity;
    }
    return subtotal;
};

// Utility function to calculate total based on subtotal, tax, and shipping fee
export const calculateTotal = (subtotal: number, tax: number, shippingFee: number): number => {
    const total = subtotal + tax + shippingFee;
    return total;
};
