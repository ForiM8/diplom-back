import express from "express";
import { DB } from "./../config/database/database.js";

const router = express.Router();
const CATEGORIES = DB.collection("categories");

router.get("/post/category", async (req, res) => {
  try {
    const result = await CATEGORIES.find().toArray();
    console.log("/post/category result - ", result);
    res.status(200).json({ response: "true", result: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "false", error: error.message });
  }
});

router.post("/post/category", async (req, res) => {
  try {
    const result = await CATEGORIES.insertMany(req.body);
    console.log("req.body - ", req.body.map);
    res.status(200).json({ response: "true", body: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "false", error: error.message });
  }
});

router.get("/get/category/:slug", async (req, res) => {
  const { slug } = req.params;
  console.log("/get/category slug - ", slug);
  try {
    const result = await CATEGORIES.findOne({ slug });
    console.log("/get/category/:slug result - ", result);
    res.status(200).json({ response: "true", result: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "false", error: error.message });
  }
});

export default router;
