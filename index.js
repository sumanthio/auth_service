"use strict";

const Hapi = require("@hapi/hapi");

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
    handler: (request, h) => {
      // get the payload
      // validate
      // store in the database
      // send back 200 and
      // handle errors accordinly
      return "signup";
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
