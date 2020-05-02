import { sign } from "jsonwebtoken";

export const createRefreshToken = (user: any) => {
  return sign({ userID: user.id }, process.env.COOKIE_TOKEN_SECRET!, {
    expiresIn: "2d",
  });
};

export const createAuthToken = (user: any) => {
  return sign({ userID: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};
