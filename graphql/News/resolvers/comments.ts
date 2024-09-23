import { Resolver, Query, Mutation, Arg,UseMiddleware,Ctx } from "type-graphql";

import { NewsComments,NewsCommentsPaginated } from '../types/comments';
import { New } from '../types/new';
import { CreateNewsCommentInput, UpdateNewsCommentInput,NewsCommentFilter } from '../inputs/comments';
import { isAuth } from "../../../auth/isAuth";
import { Context } from 'vm';
import { PageInfo } from '../../Common/types/page_info';


@Resolver()
export class NewsCommentsResolver {
  
  @UseMiddleware(isAuth)
  @Query(() => NewsCommentsPaginated)
    async GetNewsComments(@Arg("filter", {nullable: true}) filter?: NewsCommentFilter) {
      let limit = 100;
      let page = 0;
      let where = {};
  
      if(filter){
        if (filter?.id_new) {
          Object.assign(where,{id_new: filter.id_new });
        }
        if (filter?.page) {
          page = filter.page - 1;
        }
        if (filter?.limit) {
          limit = filter.limit;
        }
      }
  
      if(page<0 || isNaN(page)){
        throw new Error ("Invalid page. It should greather than 0")
      }

      if(limit<=0 || isNaN(limit)){
        throw new Error ("Invalid limit. It should greather than 0")
      }

      const totalCount = await NewsComments.count({where})
      const totalPages = Math.ceil(totalCount/limit);
      const info: PageInfo = {
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        totalPages,
        currentPage: page
      }
  
      const elements = await NewsComments.find({
        relations: ["created_by"],
        where,
        take: limit,
        skip: page*limit
      });
  
      const paginatedResults: NewsCommentsPaginated = {
        elements,
        info
      }
  
      return paginatedResults;
    }
    
  @UseMiddleware(isAuth)
  @Mutation(() => NewsComments!)
    async AddNewsComments(@Ctx() context: Context,@Arg("data") data: CreateNewsCommentInput) {
      
      const newSearch = await New.findOne({where: {id: data.id_new}})
      if(newSearch){
        return new Error("New not exists")
      }

      const newsComment = new NewsComments()
      newsComment.id_new = data.id_new;
      newsComment.text = data.text;
      newsComment.created_by = context.payload._id;
    
      return await newsComment.save()
    }

  @UseMiddleware(isAuth)
  @Mutation(() => NewsComments)
  async UpdateNewsComments(@Arg("id") id: string, @Arg("data") data: UpdateNewsCommentInput) {
    const newCommentDetails = await NewsComments.findOne({ where: { id } });
    if (!newCommentDetails) throw new Error("New not found");
    Object.assign(newCommentDetails, data);

    await newCommentDetails.save();

    return newCommentDetails;
  }
}