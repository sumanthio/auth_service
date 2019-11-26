"use strict";

const Hapi = require("@hapi/hapi");
const Mongoose = require("mongoose");
const Users = require("./models/user.model");

const MongoDBURL = `mongodb://sumanth:cNr#ld3TP$28@ds251849.mlab.com:51849/tenesse_mark_2`;

Mongoose.connect(MongoDBURL, {
  useNewUrlParser: true
});

Mongoose.connection.on("connected", () => {
  console.log("DB connection established");
});

Mongoose.connection.on("error", error => {
  console.log("DB connection screwed", error);
});

const init = async () => {
  const server = Hapi.server({
    port: "1024",
    host: "localhost"
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Welcome";
    }
  });

  server.route({
    method: "POST",
    path: "/register",
    handler: async (req, h) => {
      // get the payload
      const userData = req.payload;
      const { first_name, last_name, email, password } = userData;
      // validate
      // check if the user is present
      const user = await Users.findOne({ email });
      if (!user) {
        //encrypt the password
        //save the user and
        try {
          const createUser = await Users.create(userData);
          return { status: `${createUser.email}'s account is created` };
        } catch (err) {
          console.log(err);
        }

        // send back 200
      }

      // handle errors accordinly
      return "signup";
    }
  });

  server.route({
    method: "POST",
    path: "/login",
    handler: (request, h) => {
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
