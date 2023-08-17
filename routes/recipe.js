import express, { request } from "express";
import {prisma} from "../db/index.js";

export default function recipeRouter(passport){
const router = express.Router(); //build a router to append to server

    //GET /recipe
    router.get("/", async (_request, response) =>{
      const recipes = await prisma.recipe.findMany();
    
      if (recipes.length >= 1){
        response.status(200).json({
          success: true,
          recipes
        })
      } else {
        response.status(200)({
          success: true,
          message: "no recipes found"
        })
      }
    })

     //Get All Recipes
  router.get("/", async (request, response) => {
    try {
      const recipes = await prisma.recipe.findMany({
        orderBy: {
          userId: "asc"
        },
        include: {
          user: true
        }
      });

      if (recipes) {
        response.status(200).json({
          success: true,
          recipes
        });
      };
    } catch (e) {
      response.status(500).json({
        success: false,
        message: "Could not find recipes"
      });
    };
  });
    
    //POST /recipe
    router.post("/", passport.authenticate("jwt", { session: false}),
    async (request, response)=>{
      try{
        const newRecipe = await prisma.recipe.create({
          data: {
            name: request.body.name,
            description: request.body.description,
            userId: 1 //static id for now
          }
        });
        if (newRecipe){
          response.status(201).json({
            success: true,
            message: "Created a new recipe"
          })
        } else {
          response.status(500).json({
            success: false,
            message: "failed to create a recipe"
          })
        }
      } catch(e){
          response.status(500).json({
            success: false,
            message: "failed to create a recipe",
          });
      }
    })
    
    //GET 1 by id /recipe/123 
    router.get("/:recipeId", async (request, response, next)=>{
      const recipeId = request.params.recipeId;
      if(recipeId === "user") {
        next('route');
      } else {
    
      try {
        const foundRecipe = await prisma.recipe.findFirstOrThrow({
          where: {
            id: parseInt(recipeId)
          }
        });
         if (foundRecipe) {

          response.status(200).json({
            success: true,
            recipe: foundRecipe
          })
         };
        
      } catch(e){
        response.status(404).json({
          success: false,
          message: "Could not find the recipe"
        });
      };
    }
      
    });

    //GET all recipes for the currently logged in user
    router.get(
      "/user",
      passport.authenticate("jwt", { session: false }),
      async (request, response) => {
          try {
              const recipes = await prisma.recipe.findMany({
                  where: {
                      userId: request.user.id
                  }
              });

              if (recipes) {
                  response.status(200).json({
                      success: true,
                      recipes
                  });
              };
          } catch (e) {
              response.status(500).json({
                  success: false,
                  message: "You must be logged in!"
              });
          };
      });

    //EDIT/recipe
    router.put("/:recipeId", passport.authenticate("jwt", {session: false}),
     async (request, response) =>{
        const recipeId = request.params.recipeId;

        try{
            const editRecipe = await prisma.recipe.updateMany( {
                where: {
                    id: parseInt(recipeId),
                    userId: request.user.id
                },
              });
              
              if (editRecipe) {
                const updatedRecipe = await prisma.recipe.update({
                    where: {
                        id: parseInt(recipeId)
                    },
                    data: {
                        name: request.body.name,
                        description: request.body.description
                    }
                });

                if (updatedRecipe) {
                    response.status(200).json({
                        success: true
                    });
                } else {
                    response.status(500).json({
                        success: false,
                        message: "Failed to update recipe"
                    });
                };
            };
        } catch (e) {
            response.status(500).json({
                success: false,
                message: "Could not find recipe"
            });
        };
    });
   
        
        
    //DELETE/recipe
    router.delete("/:recipeId", passport.authenticate("jwt", {session: false}),
    async (request, response) =>{
        const recipeId = request.params.recipeId;

        try{
            const deleteRecipe = await prisma.recipe.delete( {
                where: {
                    id: parseInt(recipeId),
                    userId: request.user.id
                }
              });
              if (deleteRecipe) {
                const deleteRec = await prisma.recipe.delete({
                    where: {
                        id: parseInt(id)
                    }
                });

                if (deleteRec) {
                    response.status(200).json({
                        success: true
                    });
                } else {
                    response.status(500).json({
                        success: false,
                        message: "Failed to delete recipe"
                    });
                };
            } else {
                response.status(500).json({
                    success: false,
                    message: "Something went wrong"
                });
            };
        } catch (e) {
            response.status(500).json({
                success: false,
                message: "Could not find recipe"
            });
        };
    });
               
    return router
    };