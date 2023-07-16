const express = require('express');
const operations = require('../../models/contacts');
const { bodySchema, favoriteShcema } = require('../../validator');
const router = express.Router();
const isValidId = require('../../idvalidator');

router.get('/', async (req, res, next) => {
	try {
		const contacts = await operations.listContacts();
		res.json(contacts);
	} catch (error) {
		next(error);
	}
});

router.get('/:id', isValidId, async (req, res, next) => {
	try {
		const contact = await operations.getContactById(req.params.id);

		if (contact === undefined) {
			throw { status: 404, message: 'Not found' };
		}
		res.json(contact);
	} catch (error) {
		next(error);
	}
});

router.post('/', async (req, res, next) => {
	try {
		const { error } = await bodySchema.validate(req.body);

		if (error) {
			throw { status: 400, message: 'missing required name field' };
		}
		const contact = await operations.addContact(req.body);
		res.status(201).json(contact);
	} catch (error) {
		next(error);
	}
});

router.delete('/:id', isValidId, async (req, res, next) => {
	try {
		const deletedContact = await operations.removeContact(req.params.id);
		if (!deletedContact) {
			throw { status: 404, message: 'Not found' };
		}
		res.json({ message: 'contact deleted' });
	} catch (error) {
		next(error);
	}
});

router.put('/:id', isValidId, async (req, res, next) => {
	try {
		const { error } = await bodySchema.validate(req.body);

		if (error) {
			throw { status: 400, message: 'missing required name field' };
		}

		const updatedContact = await operations.updateContact(
			req.params.id,
			req.body
		);

		if (!updatedContact) {
			throw { status: 404, message: 'Not found' };
		}

		res.json(updatedContact);
	} catch (error) {
		next(error);
	}
});

router.patch('/:id/favorite', isValidId, async (req, res, next) => {
	try {
		const { error } = favoriteShcema.validate(req.body);

		if (error) {
			throw { status: 400, message: 'missing field favorite' };
    }
    const updateContact = await operations.updateStatusContact(req.params.id, req.body);
    res.json(updateContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
