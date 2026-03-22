import express from "express";
import {
  getAllCharacters,
  addCharacter,
  updateCharacter,
  deleteCharacter,
  addForm,
  deleteForm,
  addMoment,
  updateMoment,
  deleteMoment
} from "../controllers/characterController.js";

const router = express.Router();

router.get("/all", getAllCharacters);

// CHARACTER CRUD
router.post("/add", addCharacter);
router.put("/:id", updateCharacter);
router.delete("/:id", deleteCharacter);

// FORMS
router.post("/:characterId/form", addForm);
router.delete("/:characterId/form/:formId", deleteForm);

// MOMENTS
router.post("/:characterId/moment", addMoment);
router.put("/:characterId/moment/:momentId", updateMoment);
router.delete("/:characterId/moment/:momentId", deleteMoment);

export default router;