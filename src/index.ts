"use strict";

import * as Hapi from "@hapi/hapi";
import Boom from "@hapi/boom";
import * as bcrypt from "bcrypt";
import Mongoose from "mongoose";
import User from "./models/user.model";
import registerValidator from "./validators";
// const { secrets } = require("./secrets");
const MongoDBURL = `mongodb://sumanth:cNr#ld3TP$28@ds251849.mlab.com:51849/tenesse_mark_2`;

Mongoose.connect(MongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
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
    host: "localhost"
  });

  server.route({
    method: "GET",
    path: "/",
    handler: () => {
      return "Welcome";
    }
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
      const newUser = { first_name, last_name, password: hashedPassword, email };
      try {
        const userCreated = await User.create(newUser);
        console.log(userCreated);
        return { status: `${userCreated}'s registered` };
      } catch (err) {
        return Boom.badRequest(err);
      }
    }
  });

  server.route({
    method: "POST",
    path: "/login",
    handler: () => {
      // get the payload
      // validate
      // verify in the database by query
      // send back 200 and
      // handle errors accordinly
      return "login";
    }
  });

  await server.start();
  console.log(`Server started at ${server.info.uri}`);
})();

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});
