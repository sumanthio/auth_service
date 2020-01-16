import { Resolver, Query, Mutation, Arg, ObjectType, Field } from "type-graphql";
import * as bcrypt from "bcrypt";
import Boom from "@hapi/boom";
import { registerValidator } from "./validators";
import User from "./models/user.model";
import { sign } from "jsonwebtoken";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "World";
  }

  @Mutation(() => Boolean)
  async register(@Arg("first_name") first_name: string, @Arg("last_name") last_name: string, @Arg("email") email: string, @Arg("password") password: string) {
    const { error }: any = registerValidator({ first_name, last_name, email, password });
    if (error) return Boom.badRequest(error);

    const existingUser = await User.findOne({ email });
    if (existingUser) return Boom.badRequest("Email already exists");
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { first_name, last_name, password: hashedPassword, email };

    try {
      await User.create(newUser);
      return true;
    } catch (error) {
      console.log(Boom.badRequest(error));
      return false;
    }
  }

  @Mutation(() => Boolean)
  async login(@Arg("email") email: string, @Arg("password") password: string): Promise<LoginResponse> {
    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new Error("No email exists");

    const validUser = bcrypt.compareSync(password, existingUser!.password);

    if (!validUser) {
      throw new Error("No email exists");
    }

    return {
      accessToken: sign({ userID: existingUser.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" })
    };
  }
}
