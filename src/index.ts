import { AppDataSource } from "./database/data-source";
import * as express from "express";
import * as dotenv from "dotenv";
import "reflect-metadata";
import errorHandlerMiddleware from "./middleware/error.middleware";
import AuthRoute from './routes/auth.route';
import UserRoute from "./routes/user.route";
import ProductRoute from "./routes/product.route";
import CartRoute from "./routes/cart.route";
dotenv.config();

const app = express();
app.use(express.json());

const { PORT = 3000 } = process.env;

// Define your routes
const authRoute = new AuthRoute();
const userRoute = new UserRoute();
const productRoute = new ProductRoute();
const cartRoute = new CartRoute();


app.get("/api/v1", (req, res) => {
  res.json({
      message:"E-COMMERCE API V1, [Health check::: API up and running]"
      //postmanLink: "https://www.postman.com/galactic-resonance-793427/workspace/babban-gona-hackathon/collection/26636754-1a805b8c-845a-4776-a9fd-1ca256404349?action=share&creator=26636754"
  })
});

// Use your routes
app.use('/api/v1', authRoute.router);
app.use('/api/v1', userRoute.router);
app.use('/api/v1', productRoute.router);
app.use('/api/v1', cartRoute.router);

app.use(errorHandlerMiddleware);

app.get('/', (req, res) => {
    return res.json('Established connection!');
  });
  
  AppDataSource.initialize()
    .then(async () => {
      app.listen(PORT, () => {
        console.log("Server is running on http://localhost:" + PORT);
      });
      console.log("Data Source has been initialized!");
    })
    .catch((error) => console.log(error));




