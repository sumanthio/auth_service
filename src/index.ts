"use strict";
import "dotenv/config";
import "reflect-metadata";
import * as Hapi from "@hapi/hapi";
import Boom from "@hapi/boom";
import * as bcrypt from "bcrypt";
import Mongoose from "mongoose";
import { sign } from "jsonwebtoken";
import { ApolloServer } from "apollo-server-hapi";

import User from "./models/user.model";
import { registerValidator, loginValidator } from "./validators";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./UserResolver";
const MongoDBURL = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

Mongoose.connect(MongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

Mongoose.connection.on("connected", () => {
  console.log("DB connection established");
});

Mongoose.connection.on("error", (error: Mongoose.Error) => {
  console.log("DB connection screwed", error);
});

(async () => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
  });

  const server = new Hapi.Server({
    port: "1024",
    host: "localhost",
  });

  await apolloServer.applyMiddleware({ app: server });
  await apolloServer.installSubscriptionHandlers(server.listener);

  server.route({
    method: "GET",
    path: "/",
    handler: () => {
      return "Welcome";
    },
  });

  server.route({
    method: "POST",
    path: "/register",
    handler: async ({ payload }): Promise<any | void> => {
      const { first_name, last_name, email, password }: any = payload;

      const { error }: any = registerValidator(payload);
      if (error) return Boom.badRequest(error);

      const existingUser = await User.findOne({ email });
      if (existingUser) return Boom.badRequest("Email already exists");

      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = {
        first_name,
        last_name,
        password: hashedPassword,
        email,
      };
      try {
        const userCreated: Mongoose.Document | any = await User.create(newUser);
        return { status: `${userCreated.email}'s registered` };
      } catch (err) {
        return Boom.badRequest(err);
      }
    },
  });

  server.route({
    method: "POST",
    path: "/login",
    handler: async ({ payload }): Promise<any> => {
      const { email, password }: any = payload;
      const { error }: any = loginValidator(payload);
      if (error) return Boom.badRequest(error);

      try {
        const userExists = await User.findOne({ email });
        if (userExists) {
          if (bcrypt.compareSync(password, userExists.password)) {
            return sign(
              { userID: userExists.id },
              process.env.ACCESS_TOKEN_SECRET!,
              { expiresIn: "15m" }
            );
          }
        }
      } catch (err) {
        return Boom.badRequest(err);
      }
    },
  });

  await server.start();
  console.log(`Server started at ${server.info.uri}`);
})();

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
