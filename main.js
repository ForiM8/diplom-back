import express from "express";
import cors from "cors";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import authRoutes from "./components/authRoutes.js";
import userRoutes from "./components/userRoutes.js";
import productRoutes from "./components/productRoutes.js";
import categoryRoutes from "./components/categoryRoutes.js";
import orderRoutes from "./components/orderRoutes.js";
import messengerRoutes from "./components/messengerRoutes.js";
import { DB } from "./config/database/database.js";

const APP = express();
const PORT = 3453;

APP.use(cors({}), express.json());

// Настройка сессий
APP.use(
  session({
    secret: "3n0JogsPMZV/ms+1oEoUYIfscuiRQwChykQE8HUi1mo=",
    resave: false,
    saveUninitialized: false,
  })
);

// Инициализация Passport и сессий
APP.use(passport.initialize());
APP.use(passport.session());

// Настройка локальной стратегии
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await DB.collection("users").findOne({
        email: username,
        password: password,
      });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect username or password" });
      }
    } catch (error) {
      return done(error);
    }
  })
);

// Сериализация и десериализация пользователя
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await DB.collection("users").findOne({ _id: id });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Использование маршрутов
APP.use(authRoutes);
APP.use(userRoutes);
APP.use(productRoutes);
APP.use(categoryRoutes);
APP.use(orderRoutes);
APP.use(messengerRoutes);

APP.listen(PORT, () => {
  console.log(`Server is running via https://localhost:${PORT}`);
});
