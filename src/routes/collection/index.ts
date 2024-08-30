import express from "express";
import attachPostHandlers from "./post";
const router = express.Router();

attachPostHandlers(router);

export default router;
