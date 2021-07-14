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

router.patch('/currentlyreading-book/:id', bookController.currentlyreadingBook);
router.patch('/read-book/:id', bookController.readBook);
router.patch('/wanttoread-book/:id', bookController.wanttoreadBook);

router.patch('/uncurrentlyreading-book/:id', bookController.uncurrentlyreadingBook);
router.patch('/unread-book/:id', bookController.unreadBook);
router.patch('/unwanttoread-book/:id', bookController.unwanttoreadBook);

module.exports = router;