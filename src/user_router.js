const Router = require('../Body_js/body');
const controller = require('./user_controller');
const router = new Router();

router.get('/users', controller.getUsers);

router.post('/users', controller.createUser);

router.post('/users/update', controller.updateUser);

module.exports = router;