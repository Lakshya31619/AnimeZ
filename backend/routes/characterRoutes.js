import express from "express";
import {
  getAllCharacters,
  addCharacter,
  updateCharacter,
  deleteCharacter,
  addForm,
  updateForm,
  deleteForm,
  addMoment,
  updateMoment,
  deleteMoment,
  addHistory,
  updateHistory,
  deleteHistory
} from "../controllers/characterController.js";

const router = express.Router();

router.get("/all", getAllCharacters);

// CHARACTER CRUD
router.post("/add", addCharacter);
router.put("/:id", updateCharacter);
router.delete("/:id", deleteCharacter);

// FORMS
router.post("/:characterId/form", addForm);
router.put("/:characterId/form/:formId", updateForm);
router.delete("/:characterId/form/:formId", deleteForm);

// MOMENTS (video clips — managed via AddMoments page)
router.post("/:characterId/moment", addMoment);
router.put("/:characterId/moment/:momentId", updateMoment);
router.delete("/:characterId/moment/:momentId", deleteMoment);

// HISTORY (text-based story/lore entries — managed via Characters admin History button)
router.post("/:characterId/history", addHistory);
router.put("/:characterId/history/:historyId", updateHistory);
router.delete("/:characterId/history/:historyId", deleteHistory);

export default router;