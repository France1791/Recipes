import express from "express";
import passport from "passport";
import recipeRouter from "./routes/recipe.js";
import userRouter from "./routes/user.js";
import authRouter from ".routes/auth.js";
import setupJWTStrategy from "./auth/index.js";

export default function createServer() {
    const app = express();

    app.use(express.json());

    setupJWTStrategy(passport);
  
    setupJWTStrategy(passport);
    
    app.use("/auth", authRouter);
    
    app.use("/recipes", recipeRouter(passport));
    
    return app;
  
}