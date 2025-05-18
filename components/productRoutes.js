import express from "express";
import { DB } from "./../config/database/database.js";
import { ObjectId } from "mongodb";

const router = express.Router();
const PRODUCTS = DB.collection("products");

router.post("/post/products", async (req, res) => {
  console.log("/post/products - ", req.body);
  try {
    const result = await PRODUCTS.insertOne(req.body);
    console.log("req.body - ", req.body.map);
    res.status(200).json({ response: "true", body: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "false", error: error.message });
  }
});

router.get("/get/products/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await PRODUCTS.find({ categorySlug: slug }).toArray();
    console.log("/get/products result - ", result);
    res.status(200).json({ response: "true", result: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "false", error: error.message });
  }
});

router.get("/get/products/userId/:slug", async (req, res) => {
  const { slug } = req.params;
  console.log("Получен параметр slug:", slug);

  if (!slug) {
    return res
      .status(400)
      .json({ response: "false", error: "Параметр slug отсутствует" });
  }

  try {
    const result = await PRODUCTS.find({ "user.email": slug }).toArray();
    console.log("Результат запроса:", result);
    res.status(200).json({ response: "true", result: result });
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
    res.status(500).json({ response: "false", error: error.message });
  }
});

router.get("/get/productsById/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    console.log("/get/products slug - ", slug);
    const objectId = new ObjectId(slug);
    console.log("/get/products objectId - ", objectId);
    const result = await PRODUCTS.findOne({ _id: objectId });
    console.log("/get/products result - ", result);
    res.status(200).json({ response: "true", result: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "false", error: error.message });
  }
});

export default router;
