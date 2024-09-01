const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ErrorHandler = require("../middleware/error");
const ArtworkController = require('../controller/artwork')

const { authMiddleware, roleAuth, validateArtworkCreation, validateArtworkSearch, validateArtworkId } = require('../middleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/search', validateArtworkSearch, ErrorHandler(ArtworkController.search));

router.post('/upload', authMiddleware, roleAuth(['artist']), upload.single('image'), validateArtworkCreation, ErrorHandler(ArtworkController.uploadArtwork));

router.put('/update/:id', authMiddleware, roleAuth(['artist']), upload.single('image'), validateArtworkId, validateArtworkCreation, ErrorHandler(ArtworkController.updateArtwork));

router.get('/:artworkId', authMiddleware, roleAuth(['artist']), validateArtworkId, ErrorHandler(ArtworkController.getArtworkDetailsById));

router.put('/mark-as-sold/:artworkId', authMiddleware, validateArtworkId, ErrorHandler(ArtworkController.marksArtworkAsSold));



module.exports = router;