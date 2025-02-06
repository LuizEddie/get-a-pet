const PetController = require('../controllers/PetController');

const router = require('express').Router();

router.post('/create', PetController.create);

module.exports = router;