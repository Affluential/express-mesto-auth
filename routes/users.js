const router = require('express').Router();

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getMe,
} = require('../controllers/user');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:id', getUser);
router.patch('/me', updateUser);
router.patch('me/avatar', updateAvatar);
module.exports = router;
