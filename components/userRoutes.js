import express from "express";
import { DB } from "./../config/database/database.js";
import { ObjectId } from "mongodb";

const router = express.Router();
const USERS = DB.collection("users");

router.patch("/patch/user", async (req, res) => {
  try {
    const user = await USERS.updateOne(
      {
        _id: new ObjectId(req.body.id),
      },
      {
        $set: {
          email: req.body.email,
          name: req.body.name,
          phone: req.body.phone,
          city: req.body.city,
        },
      }
    );
    console.log("/patch/user - ", req.body);
    console.log("/patch/user user - ", user);
    return res.json({
      response: "true",
      result: {
        accessToken:
          "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nywic3RhdHVzIjoxLCJyb2xlIjozLCJpYXQiOjE3NDY3MTk4MTAsIm5iZiI6MTc0NjcxOTgxMCwiZXhwIjoxNzQ2NzIwNzEwfQ.l_M9VDFGkrtT5Q_y3eX1M5j-MjMu-PAFQPhjHC1zu0U5x0QuhcOyvZbHPV8PKONNwB4X73XWrROHIUhm6ar5jA",
        refreshToken: "a5c5462c-7021-4480-8d03-6e7f341fb44e",
        status: 1,
      },
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/get/user", async (req, res) => {
  try {
    const user = await USERS.findOne({
      email: req.body.email,
    });
    console.log("/get/login - ", req.body);
    return res.json({
      response: "true",
      result: {
        user: user,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/post/users", async (req, res) => {
  try {
    await USERS.insertOne(req.body);
    console.log("req.body - ", req.body);
    res
      .status(200)
      .json({ result: { status: 200, response: "true", message: "200" } });
  } catch (error) {
    console.log("/users error -", error);
    res.status(500).json({ status: 500, response: "false", message: "500" });
  }
});

export default router;
