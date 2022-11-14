const express = require('express');
const { check } = require('express-validator');

const itemsControllers = require('../controllers/items-controllers');

const router = express.Router();

router.get('/recent', itemsControllers.getRecentItems)

router.get('/:itemid', itemsControllers.getItem);

router.post('/', [
    check('author').not().isEmpty(),
    check('origin').not().isEmpty(),
    check('name').not().isEmpty(),
    check('tags').isLength({ min: 1 }),
    check('description').not().isEmpty()
],itemsControllers.addItem);

router.patch('/:itemid', [
    check('name').not().isEmpty(),
    check('tags').not().isEmpty(),
    check('image').not().isEmpty(),
    check('description').not().isEmpty(),
],itemsControllers.updateItem);

router.delete('/:itemid', itemsControllers.deleteItem);

module.exports = router;