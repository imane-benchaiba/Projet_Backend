const router = require('express').Router();
const authorController = require('../controllers/author.controller');
const multer = require("multer"); // pour le traitement d'image
const upload = multer();

router.get('/', authorController.readAuthors);
router.post('/', upload.single("file"), authorController.createAuthor);
router.put('/:id', authorController.updateAuthor);
router.delete('/:id', authorController.deleteAuthor);

module.exports = router;