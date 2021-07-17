const router = require('express').Router();
const bookController = require('../controllers/book.controller');
const multer = require("multer"); // pour le traitement d'image
const upload = multer();

router.get('/', bookController.readBooks);
router.post('/', upload.single("file"), bookController.createBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

// comments
router.patch('/comment-book/:id', bookController.commentBook);
router.patch('/edit-comment-book/:id', bookController.editCommentBook);
router.patch('/delete-comment-book/:id', bookController.deleteCommentBook);



module.exports = router;