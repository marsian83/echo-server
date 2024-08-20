import express from "express";
import attachPostHandlers from "./post";
import attachGetHandlers from "./get";
const router = express.Router();

attachGetHandlers(router);
attachPostHandlers(router);

export default router;
