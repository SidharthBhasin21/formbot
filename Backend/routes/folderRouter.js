const express = require("express");
const router = express.Router();

const Folder = require("../models/folderModel");

const { isLoggedIn } = require("../middlewares/isLoggedIn");
const { getFolder, createFolder, deleteFolder, getAllFolders } = require("../controllers/folderController");

router.post("/create", isLoggedIn, createFolder)

router.get("/:dashboardId", isLoggedIn, getAllFolders)
router.get("/:id", isLoggedIn, getFolder)

router.delete("/:id", isLoggedIn, deleteFolder)


module.exports = router;