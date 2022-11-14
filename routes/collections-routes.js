const express = require('express');
const { check } = require('express-validator');

const collectionsControllers = require('../controllers/collections-controllers');

const router = express.Router();

router.get('/biggest', collectionsControllers.getBiggestCollections);

router.get('/user/:uid', collectionsControllers.getUserCollections);

router.get('/:cid', collectionsControllers.getCollectionById);

router.post('/',
    [
        check('name').not().isEmpty(),
        check('description').isLength({ min: 5 }),
        check('topic').not().isEmpty(),
        check('creator').not().isEmpty()
    ],
    collectionsControllers.createCollection
);

router.patch('/:cid', 
    [
        check('name').not().isEmpty(),
        check('description').isLength({ min: 5 }),
        check('topic').not().isEmpty(),
    ],
    collectionsControllers.updateCollection
);

router.delete('/:cid', collectionsControllers.deleteCollection);

module.exports = router;