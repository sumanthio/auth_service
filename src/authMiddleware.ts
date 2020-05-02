import { MiddlewareFn } from "type-graphql";
import MyContext from "./MyContext";
import { verify } from "jsonwebtoken";

export const AuthMiddleware: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authHeader = context.request.headers["authorization"];

  if (!authHeader) {
    throw new Error("Not authorized");
  }
  try {
    const token = authHeader.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (error) {
    throw new Error("Not authorized");
  }

  return next();
};
