import { Resolver, Query, Mutation, Arg, UseMiddleware, Ctx } from "type-graphql";
import { Like } from 'typeorm';
import { NewCategory, NewCategoriesPaginated } from '../types/category';
import { CreateNewCategoryInput, UpdateNewCategoryInput, NewCategoryFilter } from '../inputs/category';
import { isAuth } from "../../../auth/isAuth";
import { Context } from 'vm';
import { PageInfo } from '../../Common/types/page_info';


@Resolver()
export class NewCategoryResolver {
  
  @UseMiddleware(isAuth)
  @Query(() => NewCategoriesPaginated)
  async GetNewCategories(@Arg("filter", { nullable: true }) filter?: NewCategoryFilter) {

    let limit = 100;
    let page = 0;
    let where = {};

    if (filter) {
      if (filter?.name) {
        Object.assign(where, { title: Like(`%${filter.name}%`) });
      }
      if (filter?.page) {
        page = filter.page - 1;
      }
      if (filter?.limit) {
        limit = filter.limit;
      }
    }

    if (page < 0 || isNaN(page)) {
      throw new Error("Invalid page. It should greather than 0")
    }
    if (limit <= 0 || isNaN(limit)) {
      throw new Error("Invalid limit. It should greather than 0")
    }

    const totalCount = await NewCategory.count({ where })
    const totalPages = Math.ceil(totalCount / limit);
    const info: PageInfo = {
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      totalPages,
      currentPage: page
    }

    const elements = await NewCategory.find({
      relations: ["created_by"],
      where,
      take: limit,
      skip: page * limit
    });

    const paginatedResults: NewCategoriesPaginated = {
      elements,
      info
    }

    return paginatedResults;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => NewCategory!)
  async AddNewCategory(@Ctx() context: Context, @Arg("data") data: CreateNewCategoryInput) {

    const newCategory = new NewCategory()
    newCategory.name = data.name;
    newCategory.created_by = context.payload._id;

    return await newCategory.save()
  }

  @UseMiddleware(isAuth)
  @Mutation(() => NewCategory)
  async UpdateNewCategory(@Arg("id") id: string, @Arg("data") data: UpdateNewCategoryInput) {

    const newCategory = await NewCategory.findOne({ where: { id } });
    if (!newCategory) throw new Error("New not found");

    Object.assign(newCategory, data);
    await newCategory.save();
    return newCategory;
  }
}

