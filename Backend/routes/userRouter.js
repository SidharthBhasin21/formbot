const express = require('express');
const { loginUser, registerUser, logoutUser } = require('../controllers/authController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const { getDashboard } = require('../controllers/dashboardController');
const router = express.Router();


router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', logoutUser)

router.get('/dashboard/:id', isLoggedIn, getDashboard )




module.exports = router;