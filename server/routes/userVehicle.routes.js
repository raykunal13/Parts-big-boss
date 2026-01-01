import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { 
  addVehicle, 
  getUserVehicles, 
  activateVehicle,
  getReorderSuggestions 
} from "../controllers/userVehicle.controller.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Garage Management
router.route("/")
  .get(getUserVehicles)
  .post(addVehicle);

router.patch("/:id/activate", activateVehicle);

// Suggestions
router.get("/reorder-suggestions", getReorderSuggestions);

export default router;