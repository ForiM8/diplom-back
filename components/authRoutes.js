import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { DB } from "./../config/database/database.js";

const router = express.Router();
const USERS = DB.collection("users");

// Маршрут для входа
router.post("/auth/login", async (req, res) => {
  try {
    const user = await USERS.findOne({
      email: req.body.email,
    });
    console.log("/auth/login - ", req.body);
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

// Маршрут для выхода
router.get("/auth/logout", (req, res) => {
  console.log("/auth/logout - ", req.body);
  req.logout();
  res.redirect("/");
});

// Маршрут для обновления токена
router.post("/auth/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  try {
    const user = await verifyRefreshToken(refreshToken);
    console.log("/auth/refresh - user - ", user);
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Функция для проверки валидности refresh токена
async function verifyRefreshToken(refreshToken) {
  const user = await USERS.findOne({ refreshToken });
  return user;
}

// Функция для генерации access токена
function generateAccessToken(user) {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    "3n0JogsPMZV/ms+1oEoUYIfscuiRQwChykQE8HUi1mo=",
    {
      expiresIn: "1h",
    }
  );
  return accessToken;
}

export default router;
