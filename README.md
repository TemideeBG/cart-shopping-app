# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm start` command

## Hosted Project

#### Setup Basic Express Server

# Shopping App Schema Design

## User Story

- As a user, I want to be able to browse a catalog of products and add products to my shopping cart. 
- Users can register or login to their account and are able to view the contents of their cart and adjust the quantity of items in their cart. 
- Finally, users will be able to place an order and receive confirmation of their orders.
- Users can also leave reviews and get views of other users on products available for purchase
- Only super-admin can create products, get access to all cart items and all orders. 
- Admins also enjoy similar privileges with super-admin but dont have access to all privileges

## Requirement Analysis

### Entities:

- Authentication: This allows for registering and enabling users login to their account and also logging out. Only super-admins can assign role of admin to users
- Products: A catalogue has a list of products, each with a name, quantity, price, number of products requested, description, etc.
- Cart: This contains items from the products catalogue selected by the users
- Users/Shoppers: A user has a unique identifier, name, email, and password.
- Orders: An order has a unique identifier, the user who placed it, a list of products, tax, shipping fee and the total amount amongst other features.
- Reviews: Users can leave reviews on a particular product.

### Relationships:
- A user can view the Product catalogue, select items into cart and place an order.
- Only items selected in cart can be ordered
- A user can only access contents of carts peculiar to him
- An order can contain multiple cart items.
- Users can view reviews on a particular product and all products available
- 'ikea' company grants it's users a total discount of 5% for products added to cart whereas other companies doesn't give their users/shoppers discount

### Sper-Admin Details:
- name: "toluwanibabs@gmail.com"
- password: "everlasting"

### Postman Link:
https://www.postman.com/galactic-resonance-793427/workspace/e-commerce/collection/26636754-fdf9de40-f835-40d4-acf2-4d54c29b450b?action=share&creator=26636754


