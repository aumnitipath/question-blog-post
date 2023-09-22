import express from "express";
import { client } from "./utils/db.js";
import bodyParser from "body-parser";
import userRouter from "./apps/blogPosts.js";
import blogPostRouter from "./apps/blogPosts.js";

async function init() {
  const app = express();
  const port = 4000;
  await client.connect();

  app.use(bodyParser.json());

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/user", userRouter);
  app.use("/blogpost", blogPostRouter);

  app.get("*", (req, res) => {
    return res.status(404).json("Not found");
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

init();
