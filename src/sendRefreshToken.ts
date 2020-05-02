import * as Hapi from "@hapi/hapi";

export const sendRefreshToken = (h: Hapi.ResponseToolkit, token: string) => {
  h.state("jid", token, {
    isHttpOnly: true,
  });
};
