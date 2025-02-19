const PetController = require('../controllers/PetController');
const { imageUpload } = require('../helpers/image-upload');

const router = require('express').Router();

const verifyToken = require("../helpers/verify-token");

router.post('/create', verifyToken, imageUpload.array("images"), PetController.create);
router.get('/mypets', verifyToken, PetController.getAllUserPets);
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions);
router.get('/:id', PetController.getPetById);
router.delete('/:id', verifyToken, PetController.removePetById);
router.patch('/:id', verifyToken, imageUpload.array("images"), PetController.updatePet);
router.patch('/schedule/:id', verifyToken, PetController.schedule);
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption);
router.get('/', PetController.getAll);

module.exports = router;