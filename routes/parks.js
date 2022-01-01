const express = require('express');
const router = express.Router();
const catchAsync = require('../util/catchAsync');
const Park = require('../models/park');
const parkController = require('../controllers/parks');
const passport = require('passport');
const { isLoggedIn, isAuthor, validatePark } = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary/config');
const upload = multer({storage});

router.get('/', catchAsync(parkController.index));
router.post('/', isLoggedIn, validatePark, upload.array('image'), catchAsync(parkController.createPark));
router.get('/new', isLoggedIn, parkController.renderNew);
router.get('/:id', catchAsync(parkController.showPark));
router.put('/:id', isLoggedIn, isAuthor, validatePark, upload.array('image'), catchAsync(parkController.editPark));
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(parkController.deletePark));
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(parkController.renderEdit));

module.exports = router;