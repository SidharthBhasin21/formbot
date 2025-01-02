const express = require("express");
const { getDashboard, shareDashboard, getUserWorkspaces, getUserDashboards } = require("../controllers/dashboardController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const router = express.Router();





router.get("/user", isLoggedIn, getUserDashboards);
router.post("/share/:dashboardId", isLoggedIn, shareDashboard);
router.get("/:id", isLoggedIn, getDashboard)

module.exports = router;