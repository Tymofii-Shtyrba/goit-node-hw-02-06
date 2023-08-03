const express = require('express');
const operations = require('../../models/contacts');
const router = express.Router();
const isValidId = require('../../midlwares/idvalidator');


router.get('/', operations.listContacts);

router.get('/:id', isValidId, operations.getContactById)

router.post('/', operations.addContact)

router.delete('/:id', isValidId, operations.removeContact);

router.put('/:id', isValidId, operations.updateContact);

router.patch('/:id/favorite', isValidId, operations.updateStatusContact);

module.exports = router;
