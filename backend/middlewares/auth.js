import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.session.destroy((err) => {
      if (err) {
        console.log("error destroying session:", err);
      }
      res.clearCookie("token");
      return res.status(401).json({ message: "Unauthorized" });
    });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        req.session.destroy((err) => {
          if (err) {
            console.error("error destroying session:", err);
          }
          res.clearCookie("token");
          return res.status(401).json({ message: "Unauthorized" });
        });
      } else {
        if (!req.session.isAuthenticated || req.session.userId !== decoded.id) {
          req.session.destroy((err) => {
            if (err) {
              console.error("error destroying session:", err);
            }
            res.clearCookie("token");
            return res.status(401).json({ message: "Unauthorized" });
          });
        } else {
          req.user = decoded;
          next();
        }
      }
    });
  }
};

export default authenticate;
