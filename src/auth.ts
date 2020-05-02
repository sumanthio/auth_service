import { sign } from "jsonwebtoken";

export const createAccessToken = (user: any) => {
  return sign({ user_id: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (user: any) => {
  return sign(
    { user_id: user.id, token_version: user.token_version },
    process.env.COOKIE_TOKEN_SECRET!,
    {
      expiresIn: "2d",
    }
  );
};
