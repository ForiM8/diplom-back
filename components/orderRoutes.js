import express from "express";
import { DB } from "../config/database/database.js";

const router = express.Router();
const ORDER = DB.collection("order");

router.post("/post/order", async (req, res) => {
  try {
    const result = await ORDER.insertOne(req.body);
    console.log("req.body - ", req.body);
    res.status(200).json({ response: "true", body: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "false", error: error.message });
  }
});

router.get("/get/order", async (req, res) => {
  try {
    const result = await ORDER.find().toArray();
    console.log("/get/order result - ", result);
    res.status(200).json({ response: "true", result: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "false", error: error.message });
  }
});

router.get("/get/order/userId/:slug", async (req, res) => {
  const { slug } = req.params;
  console.log("Получен параметр slug:", slug);

  if (!slug) {
    return res
      .status(400)
      .json({ response: "false", error: "Параметр slug отсутствует" });
  }

  try {
    const result = await ORDER.find({ "user.email": slug }).toArray();
    console.log("Результат запроса:", result);
    res.status(200).json({ response: "true", result: result });
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
    res.status(500).json({ response: "false", error: error.message });
  }
});

export default router;
