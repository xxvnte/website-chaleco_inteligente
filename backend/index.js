import { app } from "./app.js";
import userRouter from "./routes/user.js";
import mainRouter from "./routes/main.js";

const port = 3000;

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

app.use(userRouter);
app.use(mainRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
