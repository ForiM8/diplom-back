import express from "express";
import { DB } from "../config/database/database.js";
import { ObjectId } from "mongodb";

const router = express.Router();
const MESSENGER = DB.collection("messenger");

router.post("/post/group", async (req, res) => {
  try {
    const result = await MESSENGER.insertOne(req.body);
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

router.get("/get/group/userId/:slug", async (req, res) => {
  const { slug } = req.params;
  console.log("Получен параметр slug:", slug);
  if (!slug) {
    return res
      .status(400)
      .json({ response: "false", error: "Параметр slug отсутствует" });
  }
  try {
    const result = await MESSENGER.find({ "customer.email": slug }).toArray();
    console.log("Результат запроса:", result);
    res.status(200).json({ response: "true", result: result });
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
    res.status(500).json({ response: "false", error: error.message });
  }
});

router.get("/get/groupById/:id", async (req, res) => {
  const { id } = req.params;
  try {
    console.log("/get/products id - ", id);
    const objectId = new ObjectId(id);
    console.log("/get/products objectId - ", objectId);
    const result = await MESSENGER.findOne({ _id: objectId });
    console.log("/get/products result - ", result);
    res.status(200).json({ response: "true", result: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "false", error: error.message });
  }
});

router.patch("/patch/group", async (req, res) => {
  console.log("/patch/group req", req.body);

  if (!req.body._id) {
    return res.status(400).json({ response: "false", error: "ID is required" });
  }

  try {
    const { _id, ...updateData } = req.body;
    const result = await MESSENGER.replaceOne(
      {
        _id: new ObjectId(req.body._id),
      },
      updateData
    );

    console.log("/patch/group result - ", result);
    if (result.modifiedCount === 0) {
      return res.status(404).json({
        response: "false",
        error: "Document not found or not modified",
      });
    }

    res.status(200).json({ response: "true", result: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "false", error: error.message });
  }
});

export default router;
