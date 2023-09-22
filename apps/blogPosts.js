import { Router, query } from "express";
import { ObjectId } from "mongodb";
import { db } from "../utils/db.js";
import { format } from "date-fns";

const blogPostRouter = Router();

blogPostRouter.get("/", async (req, res) => {
  const category = req.query.category;
  const title = req.query.title;
  const query = {};

  if (category) {
    query.category = new RegExp(category, "i");
  }
  if (title) {
    query.title = new RegExp(title, "i");
  }
  const collection = db.collection("blogPosts");
  const blogPosts = await collection
    .find(query)
    .sort({ createTime: -1 })
    .limit(10)
    .toArray();

  return res.json({
    data: blogPosts,
  });
});

blogPostRouter.get("/:id/", async (req, res) => {
  const blogPostId = new ObjectId(req.params.id);
  const collection = db.collection("blogPosts");
  const blogPosts = await collection.find({ _id: blogPostId }).toArray();

  return res.json({
    data: blogPosts[0],
  });
});

blogPostRouter.post("/", async (req, res) => {
  const formattedDate = format(new Date(), "dd MMM yyyy, HH:mm:ss");
  const newBlogPosts = { ...req.body, createTime: formattedDate };

  const collection = db.collection("blogPosts");
  await collection.insertOne(newBlogPosts);
  return res.json({
    message: "Post has been created successfully",
  });
});

blogPostRouter.put("/:id/", async (req, res) => {
  const updateTime = format(new Date(), "dd MMM yyyy, HH:mm:ss");
  const blogPostId = new ObjectId(req.params.id);
  const collection = db.collection("blogPosts");

  await collection.updateOne(
    {
      _id: blogPostId,
    },
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        updateTime: updateTime,
      },
    }
  );

  return res.json({
    message: "Post has been updated successfully",
  });
});

blogPostRouter.delete("/:id/", async (req, res) => {
  const blogPostId = new ObjectId(req.params.id);
  const collection = db.collection("blogPosts");
  await collection.deleteOne({ _id: blogPostId });
  return res.json({
    message: "Post has been delete successfully",
  });
});

export default blogPostRouter;
