import { Resolver, Query, Mutation, Arg, UseMiddleware, Ctx } from "type-graphql";
import { In, Like } from 'typeorm';
import { New, NewsPaginated } from '../types/new';
import { NewCategory } from '../types/category';
import { CreateNewInput, UpdateNewInput, NewFilter } from '../inputs/new';
import { isAuth } from "../../../auth/isAuth";

import { Context } from 'vm';
import { PageInfo } from '../../Common/types/page_info';
import { isEmpty } from "class-validator";


@Resolver()
export class NewResolver {
  @UseMiddleware(isAuth)
  @Query(() => NewsPaginated)
  async GetNews(@Arg("filter", { nullable: true }) filter?: NewFilter) {

    let where = {
      ...(filter?.title && { title: Like(`%${filter.title}%`) }),
      ...(filter?.text && { description: Like(`%${filter.text}%`) }),
      ...(filter?.short_text && { short_description: Like(`%${filter.short_text}%`) }),
      ...(filter?.image && { image: Like(`%${filter.image}%`) }),
      ...(filter?.category && { categories: { name: Like(`%${filter.category}%`) } }),
    };

    let page = filter?.page ? filter.page - 1 : 0;
    if (page < 0 || isNaN(page)) {
      throw new Error("Invalid page. It should greather than 0")
    }

    let limit = filter?.limit ?? 100;

    if (limit <= 0 || isNaN(limit)) {
      throw new Error("Invalid limit. It should greather than 0")
    }

    const totalCount = await New.count({ where })
    const totalPages = Math.ceil(totalCount / limit);
    const info: PageInfo = {
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      totalPages,
      currentPage: page
    }

    const elements = await New.find({
      
      where,
      take: limit,
      skip: page * limit,
      relations: ['categories',"created_by","updated_by","location","group","event","artist"]
    });

    const paginatedResults: NewsPaginated = {
      elements,
      info
    }

    return paginatedResults;
  }

  @UseMiddleware(isAuth)
  @Query(() => New)
  async GetNew(@Arg("id") id: string) {

    const newDetails = await New.findOne(
      {
        where: { id },
        relations: ['categories',"created_by","updated_by"]
      });
    if (!newDetails) throw new Error("New not found");
    return newDetails
  }

  @UseMiddleware(isAuth)
  @Mutation(() => New)
  async AddNew(@Ctx() context: Context, @Arg("data") data: CreateNewInput) {

    const newSearch = await New.findOne({ where: { title: data.title } })
    if (newSearch) {
      return new Error("New already exists")
    }

    const newDetails = new New()
    newDetails.title = data.title;
    newDetails.text = data.text;
    newDetails.short_text = data.short_text;
    newDetails.image = data.image;
    newDetails.created_by = context.payload._id;
    newDetails.updated_by = context.payload._id;

    // Si se proporcionaron categories, asociar categorías a la noticia
    if (data.categories.length > 0) {
      const categories = await NewCategory.find({ where: { id: In(data.categories) } }); // Buscar categorías por sus IDs
      if (categories.length > 0) {
        newDetails.categories = categories; // Asociar las categorías a la noticia
      }
    } else {
      return new Error("categories must be mandatory")
    }
    
    return await newDetails.save()
  }

  @UseMiddleware(isAuth)
  @Mutation(() => New)
  async UpdateNew(@Ctx() context: Context, @Arg("id") id: string, @Arg("data") data: UpdateNewInput) {
    const newDetails = await New.findOne({ where: { id }, relations: ['categories'] });
    if (!newDetails) throw new Error("New not found");

    // Si se proporcionaron categories, asociar categorías a la noticia
    if (!isEmpty(data.categories)) {
      const categories = await NewCategory.find({ where: { id: In(data.categories) } }); // Buscar categorías por sus IDs
      if (categories.length > 0) {

        newDetails.categories = categories; // Asociar las categorías a la noticia ///TODO Falla aquí

      }
    }
   
    const { categories, ...updatedData } = data;
    Object.assign(newDetails, { ...updatedData, updated_by: context.payload._id });

    await newDetails.save();
    return newDetails;
  }


}

