const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const multer = require("multer"); // pour le traitement d'image
const upload = multer();

// Auth
router.post("/register", authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logout);

// User
router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo);
router.put("/:id", userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/follow/:id', userController.follow);
router.patch('/unfollow/:id', userController.unfollow);


// Books
router.patch('/currentlyreading/:id', userController.currentlyreading);
router.patch('/read/:id', userController.read);
router.patch('/wanttoread/:id', userController.wanttoread);

router.patch('/uncurrentlyreading/:id', userController.uncurrentlyreading);
router.patch('/unread/:id', userController.unread);
router.patch('/unwanttoread/:id', userController.unwanttoread);

// upload
router.post("/upload", upload.single("file"), uploadController.uploadProfil);


module.exports = router;