import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  let token = req.cookies.token;
  let tokenSource = "cookie";

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
      tokenSource = "header";
    }
  }

  console.log(
    "Auth check - Cookie headers:",
    req.headers.cookie ? "Present" : "Missing"
  );
  console.log(
    "Auth check - Authorization header:",
    req.headers.authorization ? "Present" : "Missing"
  );
  console.log("Auth check - Token source:", tokenSource);
  console.log("Auth check - Token:", token ? "Present" : "Missing");
  console.log(
    "Auth check - Session:",
    req.session?.isAuthenticated ? "Authenticated" : "Not authenticated"
  );

  if (!token) {
    console.log("Authentication failed: No token provided");
    if (req.cookies.token || req.session.isAuthenticated) {
      req.session.destroy((err) => {
        if (err) console.log("Error destroying session:", err);
      });
      res.clearCookie("token");
    }
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Authentication failed: Invalid token", err.message);
      if (tokenSource === "cookie") {
        req.session.destroy((err) => {
          if (err) console.log("Error destroying session:", err);
        });
        res.clearCookie("token");
      }
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    console.log("Authentication successful for user:", decoded.id);
    req.user = decoded;

    if (!req.session.userId || req.session.userId !== decoded.id) {
      req.session.isAuthenticated = true;
      req.session.userId = decoded.id;
    }

    next();
  });
};

export default authenticate;
