import { createTRPCRouter, privateProcedure } from "../trpc";
import {z} from 'zod'
import {db} from '~/server/db'

export const categoryRouter = createTRPCRouter({
    getCategories: privateProcedure.input(z.object({
        page: z.number().optional(),
        limit: z.number().optional()
    })).query(async ({input,ctx}) => {
        let {page , limit} = input
        const user = ctx.user
        const user_id = user.user_id as number
        if(!page || !limit){
            page = 1
            limit = 6
        }
        const promises = []
        const totalItems = db.categories.count();
        const categories =  db.categories.findMany({
            skip: (page - 1) * limit,
            take: limit,
            include: {
               UserCategory:{
                     where: {
                          userId: user_id,
                            
                     },

               }
            }
        })
        
        promises.push(categories)
        promises.push(totalItems)
        const [categoriesData, total] = await Promise.all(promises)
        return {
            categories: categoriesData,
            totalItems: total
        }
    }),
    markCategory: privateProcedure.input(z.object({
        category_id: z.number(),
    })).mutation(async ({input,ctx}) => {
        const {category_id } = input
        const user = ctx.user
        console.log(user , "user"   )
        const userId:number = user.user_id as number
        const usercategory = await db.userCategory.findFirst({
            where: {
                userId:userId,
                categoryId: category_id
            },
          
        })

        if(usercategory){
            await db.userCategory.delete({
                where: {
                    id: usercategory.id
                }
            })
        
        }else{
            console.log("creating")
            await db.userCategory.create({
                data: {
                    categoryId: category_id,
                    userId:userId
                }
            })
        }
        return true
    }),
})