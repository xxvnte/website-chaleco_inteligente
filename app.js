require('dotenv').config();
const express = require('express');
const handlebars = require("express-handlebars");
const app = express();
const { Pool } = require('pg');
const session = require('express-session');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  next();
});

const hbs = handlebars.create({
    extname: "hbs",
    layoutsDir: `${__dirname}/views/layouts`,
    partialsDir: `${__dirname}/views/partials`,
    defaultLayout: "index",
    helpers: {
        eq: function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : '';
        }
    }
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tics',
  password: 'postgres',
  port: 5432,
});

pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL Database');
  })
  .catch((error) => {
    console.error(`Connection refuse: ${error}`);
  });

module.exports = { app, pool };
