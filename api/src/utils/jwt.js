import jwt from "jsonwebtoken";

const KEY = process.env.JWT_KEY;
const CAMPO_TOKEN = process.env.CAMPO_TOKEN;

export function generateToken(userInfo, remember = false) {
  if (!userInfo.role) userInfo.role = "user";

  return jwt.sign(userInfo, KEY, { expiresIn: remember ? "7d" : "20s" }); // Trocar para um tempo menor, como 20 segundos para mostrar a expiração do token
}

export function getTokenInfo(req) {
  try {
    let token = req.headers[CAMPO_TOKEN];

    if (token === undefined) token = req.query[CAMPO_TOKEN];

    let signd = jwt.verify(token, KEY);
    return signd;
  } catch {
    return null;
  }
}

export function getAuthentication(checkRole, throw401 = true) {
  return (req, resp, next) => {
    try {
      let token = req.headers[CAMPO_TOKEN];

      if (token === undefined) token = req.query[CAMPO_TOKEN];

      let signd = jwt.verify(token, KEY);

      req.user = signd;
      if (checkRole && !checkRole(signd) && signd.role.type !== "admin")
        return resp.status(403).end();

      next();
    } catch {
      if (throw401) {
        let error = new Error();
        error.stack = "Authentication Error: JWT must be provided";

        resp.status(401).end();
      } else {
        next();
      }
    }
  };
}
