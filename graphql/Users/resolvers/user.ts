import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";
import { Like } from 'typeorm';
import { User, LoginReturn, UsersPaginated } from '../types/user';
import jwt from 'jsonwebtoken';
import { CreateUserInput, UpdateUserInput, UserFilter } from '../inputs/user';
import { isAuth } from "../../../auth/isAuth";
import { PageInfo } from '../../Common/types/page_info';

@Resolver()
export class UserResolver {

  @UseMiddleware(isAuth)
  @Query(() => UsersPaginated)
  async GetUsers(@Arg("filter", { nullable: true }) filter?: UserFilter) {

    let limit = 100;
    let page = 0;
    let where = {};


    if (filter) {
      if (filter?.first_name) {
        Object.assign(where, { first_name: Like(`%${filter.first_name}%`) });
      }

      if (filter?.last_name) {
        Object.assign(where, { last_name: Like(`%${filter.last_name}%`) });
      }

      if (filter?.email) {
        Object.assign(where, { email: Like(`%${filter.email}%`) });
      }

      if (filter?.role) {
        Object.assign(where, { role: filter.role });
      }

      if (filter?.phone) {
        Object.assign(where, { phone: Like(`%${filter.phone}%`) });
      }

      if (filter?.dni) {
        Object.assign(where, { dni: Like(`%${filter.dni}%`) });
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

    const totalCount = await User.count({ where })
    const totalPages = Math.ceil(totalCount / limit);
    const info: PageInfo = {
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      totalPages,
      currentPage: page
    }

    const elements = await User.find({
      where,
      take: limit,
      skip: page * limit
    });

    const paginatedResults: UsersPaginated = {
      elements,
      info
    }

    return paginatedResults;


  }

  @UseMiddleware(isAuth)
  @Query(() => User)
  async GetUser(@Arg("id") id: string) {
    return await User.findOne({ where: { id } });
  }

  @Query(() => LoginReturn)
  async Login(@Arg("email") email: string, @Arg("password") password: string) {

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("User not found");
    }


    ///Check passwords
    if (password !== user.password) {
      throw new Error("Invalid credentials");
    }


    const token = jwt.sign({ _id: user.id, email: user.email }, process.env.PRIVATE_KEY, {
      expiresIn: "1h"

    });
    //console.log(token);
    return {
      token

    }
  }
  @UseMiddleware(isAuth)
  @Mutation(() => User)
  async AddUser(@Arg("data") data: CreateUserInput) {

    const user = User.create({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      role: data.role,
      password: data.password,
      phone: data.phone,
      dni: data.dni
    })


    await user.save()
    return user

  }
  @UseMiddleware(isAuth)
  @Mutation(() => User)
  async UpdateUser(@Arg("id") id: string, @Arg("data") data: UpdateUserInput) {
    const user = await User.findOne({ where: { id } });
    if (!user) throw new Error("User not found!");
    Object.assign(user, data);
    await user.save();
    return user;
  }


}
