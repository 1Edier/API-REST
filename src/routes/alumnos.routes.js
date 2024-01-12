const express = require('express');
const router = express.Router();
const alumnoController = require('../controllers/alumnos.controllers');

router.get('/', alumnoController.index);
router.get('/:id', alumnoController.getById);
router.post('/', alumnoController.create);
router.patch('/:id', alumnoController.updateById); 
router.delete('/:id', alumnoController.deleteById);

module.exports = router;
