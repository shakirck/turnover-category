import { createTRPCRouter, privateProcedure } from "../trpc";
import {z} from 'zod'
import {db} from '~/server/db'

export const categoryRouter = createTRPCRouter({
    getCategories: privateProcedure.input(z.object({
        user_id: z.number(),
    })).query(async ({input}) => {
        const {user_id} = input
        const categories = await db.categories.findMany()
        return categories
    }),
    markCategory: privateProcedure.input(z.object({
        category_id: z.number(),
        user_id: z.number(),
    })).mutation(async ({input}) => {
        const {category_id ,user_id} = input
        const usercategory = await db.userCategory.findFirst({
            where: {
                userId: user_id,
                categoryId: category_id
            },
          
        })

        if(usercategory){
            // remove category
            await db.userCategory.delete({
                where: {
                    id: usercategory.id
                }
            })
        
        }else{
            // add category
            await db.userCategory.create({
                data: {
                    categoryId: category_id,
                    userId: user_id
                }
            })
        }
        return true
    }),
})