import { Router, query } from "express";
import { ObjectId } from "mongodb";
import { db } from "../utils/db.js";
import { format } from "date-fns";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const collection = db.collection("user");
  const user = await collection
    .find()
    .limit(10)
    .sort({ createTime: -1 })
    .toArray();

  return res.json({
    data: user,
  });
});

userRouter.get("/:id", async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const collection = db.collection("user");
  const user = await collection.find({ _id: userId }).toArray();

  return res.json({
    data: user[0],
  });
});

userRouter.post("/", async (req, res) => {
  const formattedDate = format(new Date(), "dd MMM yyyy, HH:mm:ss");
  const newUser = { ...req.body, createTime: formattedDate };
  const collection = db.collection("user");
  await collection.insertOne(newUser);
  return res.json({
    message: "User has been created successfully",
  });
});

userRouter.put("/:id", async (res, req) => {
  try {
    const formattedDate = format(new Date(), "dd MMM yyyy, HH:mm:ss");
    const userNameId = new ObjectId(req.params.id);

    const collection = db.collection("user");

    await collection.updateOne(
      {
        _id: userNameId,
      },
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          updateTime: formattedDate,
        },
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

export default userRouter;
