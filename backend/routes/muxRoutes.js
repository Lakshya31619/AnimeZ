import express from "express";
import { generateMuxToken } from "../controllers/muxController.js";

const muxRouter = express.Router();

muxRouter.get("/:playbackId", generateMuxToken);

export default muxRouter;