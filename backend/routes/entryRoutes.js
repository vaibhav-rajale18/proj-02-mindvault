const express = require("express");
const {
  createEntry,
  getEntries,
  deleteEntry,
  getEntry,
  updateEntry,
  searchEntries,
} = require("../controllers/entryController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createEntry);
router.get("/", getEntries);
router.get("/search", searchEntries);
router.get("/:id", getEntry);
router.put("/:id", updateEntry);
router.delete("/:id", deleteEntry);

module.exports = router;
