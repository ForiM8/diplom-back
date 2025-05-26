import express from "express";
import { DB } from "../config/database/database.js";
import { ObjectId } from "mongodb";

const router = express.Router();
const BASKET = DB.collection("basket");

router.post("/post/basket", async (req, res) => {
  try {
    const result = await BASKET.insertOne(req.body);
    console.log("req.body - ", req.body);
    res.status(200).json({ response: "true", body: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "false", error: error.message });
  }
});

router.get("/get/basket", async (req, res) => {
  try {
    const result = await BASKET.find().toArray();
    console.log("/get/order result - ", result);
    res.status(200).json({ response: "true", result: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "false", error: error.message });
  }
});

router.get("/get/basket/userId/:slug", async (req, res) => {
  const { slug } = req.params;
  console.log("Получен параметр slug:", slug);

  if (!slug) {
    return res
      .status(400)
      .json({ response: "false", error: "Параметр slug отсутствует" });
  }

  try {
    const result = await BASKET.find({ "customer.email": slug }).toArray();
    console.log("Результат запроса:", result);
    res.status(200).json({ response: "true", result: result });
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
    res.status(500).json({ response: "false", error: error.message });
  }
});

router.get("/get/basket/userIdAndItemId/:email/:id", async (req, res) => {
  const { email, id } = req.params;
  console.log("Получен параметр email:", email, "и id:", id);

  if (!email || !id) {
    return res
      .status(400)
      .json({ response: "false", error: "Параметры email или id отсутствуют" });
  }

  try {
    const result = await BASKET.find({
      "customer.email": email,
      "item._id": id,
    }).toArray();
    console.log("Результат запроса:", result);
    res.status(200).json({ response: "true", result: true });
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
    res.status(500).json({ response: "false", error: error.message });
  }
});

router.delete("/clear/basket", async (req, res) => {
  try {
    const result = await BASKET.deleteMany({});
    console.log("Коллекция BASKET очищена:", result);
    res.status(200).json({
      response: "true",
      message: "Коллекция BASKET успешно очищена",
      result: result,
    });
  } catch (error) {
    console.error("Ошибка при очистке коллекции BASKET:", error);
    res.status(500).json({ response: "false", error: error.message });
  }
});

router.delete("/clear/basketById/:id", async (req, res) => {
  const { id } = req.params;
  const objectId = new ObjectId(id);
  if (!id) {
    return res
      .status(400)
      .json({ response: "false", error: "Параметр id отсутствует" });
  }

  try {
    const result = await BASKET.deleteOne({ _id: objectId });
    console.log("Документ с _id:", id, "удален:", result);
    res.status(200).json({
      response: "true",
      message: `Документ с _id ${id} успешно удален`,
      result: result,
    });
  } catch (error) {
    console.error("Ошибка при удалении документа:", error);
    res.status(500).json({ response: "false", error: error.message });
  }
});

export default router;
