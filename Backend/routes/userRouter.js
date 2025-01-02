const express = require('express');
const { loginUser, registerUser, logoutUser, updateUser } = require('../controllers/authController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const { getDashboard } = require('../controllers/dashboardController');
const router = express.Router();


router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', logoutUser)

router.get('/dashboard/:id', isLoggedIn, getDashboard )

router.post('/update', isLoggedIn, updateUser);





module.exports = router;