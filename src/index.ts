"use strict";

import * as Hapi from "@hapi/hapi";
import * as bcrypt from "bcrypt";
import Mongoose from "mongoose";
import Users from "./models/user.model";
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

const init = async () => {
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
    handler: async (req: Hapi.Request): Promise<void> => {
      // get the payload
      const userData = req.payload;
      // validate
      // check if the user is present
      try {
        const user = await Users.findOne({ email: userData.email });
        if (!user) {
          //encrypt the password
          bcrypt.hash(userData.password, 10, async (err, hash) => {
            userData.password = hash;
            console.log("here");
            const createUser = await Users.create(userData);
            // send back 200
            return { status: `${createUser.email}'s account is created` };
          });
        } else {
          return { status: `${user.email}'s account is already present` };
        }
      } catch (err) {
        console.log(err);
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
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
