"use strict";

import "dotenv/config";
import "reflect-metadata";
import * as Hapi from "@hapi/hapi";
import Boom from "@hapi/boom";
import * as bcrypt from "bcrypt";
import Mongoose from "mongoose";
import { sign, verify } from "jsonwebtoken";
import { ApolloServer } from "apollo-server-hapi";
import { buildSchema } from "type-graphql";

import User from "./models/user.model";
import { registerValidator, loginValidator } from "./validators";
import { UserResolver } from "./UserResolver";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshToken } from "./sendRefreshToken";

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
  const server = new Hapi.Server({
    port: "1024",
    host: "localhost",
  });

  server.route({
    method: "POST",
    path: "/refresh_token",
    handler: async (request, h) => {
      const jid = request.state.jid;
      if (!jid) {
        return Boom.unauthorized();
      }
      let payload: any = null;
      try {
        payload = verify(jid, process.env.COOKIE_TOKEN_SECRET!);
      } catch (error) {
        return Boom.unauthorized();
      }
      const userExists = await User.findOne({ _id: payload!.userID });
      if (!userExists) {
        return Boom.unauthorized();
      }
      sendRefreshToken(h, createRefreshToken(userExists));
      return { ok: true, access_token: createAccessToken(userExists) };
    },
  });

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

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: async ({ request, h }) => ({ request, h }),
  });

  await apolloServer.applyMiddleware({ app: server });
  await apolloServer.installSubscriptionHandlers(server.listener);
  await server.start();
  console.log(`Server started at ${server.info.uri}`);
})();

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
