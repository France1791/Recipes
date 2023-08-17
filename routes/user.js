import express from "express";
import { prisma } from "../db/index.js";

export default function userRouter(){

    const router = express.Router();

    
    router.get("/", async(request, response) => {

        //get all users
        const users = await prisma.user.findMany();

        response.status(200).json({
            success: true, 
            users 
        })
    })

    router.post("/", async(request, response) => {
        console.log('hi')
        const user = await prisma.user.create({
            data: {
                name: request.body.username 
            },
        });
        response.status(201).json({
            success: true,
        });
    });


    return router;
}
