import express from "express";
import { verifyUser, isPlatformAdmin } from "../middleware/authMiddleware.js";
import { createSociety, getSocieties, createSocietyAdmin } from "../Controllers/societyController.js";

const router = express.Router();

router.use(verifyUser);
router.use(isPlatformAdmin);

router.post("/", createSociety);
router.get("/", getSocieties);
router.post("/:id/admins", createSocietyAdmin);

export default router;
