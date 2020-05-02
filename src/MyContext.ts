import * as Hapi from "@hapi/hapi";

export default interface MyContext {
  request: Hapi.Request;
  // todo: change this to h someday
  h: Hapi.ResponseToolkit;
}
