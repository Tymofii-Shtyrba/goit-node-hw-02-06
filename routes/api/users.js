const router = require('express').Router();
const operations = require('../../models/users');
const { auth } = require('../../midlwares/auth');
const { uploadAvatar } = require('../../midlwares/avatar');


router.post('/register', operations.register)

router.post('/login', operations.login);

router.post('/logout', auth, operations.logout);

router.get('/current', auth, operations.current);

router.patch('/avatars', auth, uploadAvatar.single('avatar'), operations.changeAvatar);

module.exports = router;
