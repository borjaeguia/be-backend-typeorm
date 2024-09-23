import { MiddlewareFn } from "type-graphql";
import { verify, JwtPayload } from "jsonwebtoken";
import { Context } from "./Context";
import { User } from "../graphql/Users/types/user";
//format like bearer 21321n2bmbbj

export const isAuth: MiddlewareFn<Context> = async ({ context }, next) => {

  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new Error("Not authenticated");
  }

  try {
    const token = authorization.split(" ")[1];

    const verifyUser = verify(token, process.env.PRIVATE_KEY) as JwtPayload;


    if (!verifyUser._id) {
      throw new Error("Not authenticated");

    }

    const user = await User.findOne({ where: { id: verifyUser._id, email: verifyUser.email } });
    if (!user) {
      throw new Error("Not authenticated");

    }

    context.payload = { _id: verifyUser._id };

  } catch (err) {

    throw new Error("Not authenticated");
  }
  return next();
};