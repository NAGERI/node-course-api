import jwt from "jsonwebtoken";

const checkReqForAuthToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.tokenData = decodedToken;
        next();
      }
    });
  } else {
    res.send("Missing Authorization Header");
  }
};

export { checkReqForAuthToken };
