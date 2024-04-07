import * as jose from "jose";
// const secret = new TextEncoder().encode(
//   "cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2",
// );
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const alg = "HS256";

type Payload = {
  id: number;
  name: string;
};
export const createToken = async (payload:Payload) => {
  const jwt = await new jose.SignJWT({
    user_id: payload.id,
    name: payload.name,
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

  console.log(jwt, "createtoken");
  return jwt;
};
export const decodeAndVerifyJwtToken = async (jwt: string) => {
  try {
    console.log(jwt, "jwt decodeAndVerifyJwtToken");
    const { payload, protectedHeader } = await jose.jwtVerify(jwt, secret);
    console.log(payload, "payload  decodeAndVerifyJwtToken");
    return payload;
  } catch (error) {
    console.error(error);
  }
};
