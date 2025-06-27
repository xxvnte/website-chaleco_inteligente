import "dotenv/config";
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,  
      sameSite: "none",
      httpOnly: true,
    },
  })
);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  next();
});

const setLocals = (req, res, next) => {
  if (req.session.isAuthenticated) {
    res.locals.isAuthenticated = true;
    res.locals.userId = req.session.userId;
  } else {
    res.locals.isAuthenticated = false;
  }
  next();
};

app.use(setLocals);

export { app };
