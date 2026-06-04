const express = require("express");
const {
  createEntry,
  getEntries,
  deleteEntry,
  searchEntries,
} = require("../controllers/entryController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createEntry);
router.get("/", getEntries);
router.delete("/:id", deleteEntry);
router.get("/search", searchEntries);

module.exports = router;
