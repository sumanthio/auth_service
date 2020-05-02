import * as Hapi from "@hapi/hapi";

export default interface MyContext {
  req: Hapi.Request;
  // todo: change this to h someday
  res: Hapi.ResponseToolkit;
}
