import express, { request } from "express";
import {prisma} from "../db/index.js";

const router = express.Router(); //build a router to append to server
export default function recipeRouter(){
    //GET /recipe
    router.get("/", async (req, res) =>{
      const recipes = await prisma.recipe.findMany();
    
      if (recipes.length >= 1){
        res.status(200).json({
          success: true,
          recipes
        })
      } else {
        res.status(200)({
          success: true,
          message: "no recipes found"
        })
      }
    })
    
    //POST /recipe
    router.post("/", async (req, res)=>{
      try{
        const newRecipe = await prisma.recipe.create({
          data: {
            name: req.body.name,
            description: req.body.description,
            userId: 1 //static id for now
          }
        });
        if (newRecipe){
          res.status(201).json({
            success: true,
            message: "Created a new recipe"
          })
        } else {
          res.status(500).json({
            success: false,
            message: "failed to create a recipe"
          })
        }
      } catch(e){
          res.status(500).json({
            success: false,
            message: "failed to create a recipe",
          });
      }
    })
    
    //GET 1 by id /recipe/123 
    router.get("/:recipeId", async (req, res)=>{
      const recipeId = req.params.recipeId;
    
      try {
        const foundRecipe = await prisma.recipe.findFirstOrThrow({
          where: {
            id: parseInt(recipeId)
          }
        });
    
        res.status(200).json({
          success: true,
          recipe: foundRecipe
        })
      } catch(e){
        res.status(404).json({
          success: false,
          message: "Could not find the recipe"
        })
      }
      
    })
    router.put("/:recipeId", async (req, res) =>{
        const recipeId = req.params.recipeId;

        try{
            const editRecipe = await prisma.recipe.updateMany( {
                where: {
                    id: parseInt(recipeId)
                },
                data: {
                    name: req.body.name,
                    description: req.body.description
                }
            })
            res.status(200).json({
                success: true,
                recipe: editRecipe
              })

   
          }
        
        catch(e){
            res.status(404).json({
              success: false,
              message: "Could not edit the recipe"
            })
          }

    } )

    router.delete("/:recipeId", async (req, res) =>{
        const recipeId = req.params.recipeId;

        try{
            const deleteRecipe = await prisma.recipe.delete( {
                where: {
                    id: parseInt(recipeId)
                },
                data: {
                    name: req.body.name,
                    description: req.body.description
                }
            })
            res.status(200).json({
                success: true,
                recipe: editRecipe
              })

   
          }
        
        catch(e){
            res.status(404).json({
              success: false,
              message: "Could not delete the recipe"
            })
          }

    } )
    return router
    }