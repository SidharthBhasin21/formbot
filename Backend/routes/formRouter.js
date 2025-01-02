const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middlewares/isLoggedIn');
const {
        createForm, 
        getForm, 
        deleteForm, 
        getAllForms, 
        createFormInFolder, 
        getAllformsInFolder,
        updateForm,
        shareForm,
        countFormHit,
        saveFormResponse
    } = require('../controllers/formController');


router.post('/folder/:folderId', isLoggedIn , createFormInFolder)
router.post('/hits/:formId', countFormHit);
router.post('/response/:formId', saveFormResponse);
router.post('/:dashboardId', isLoggedIn , createForm)

router.patch('/update/:formId', isLoggedIn , updateForm);

router.get('/:dashboardId', isLoggedIn, getAllForms)
router.get('/update/:id', isLoggedIn , getForm);
router.get('/folder/:folderId', isLoggedIn, getAllformsInFolder)
router.get('/share/:formId', shareForm);


router.delete('/:id', isLoggedIn , deleteForm);







module.exports = router;