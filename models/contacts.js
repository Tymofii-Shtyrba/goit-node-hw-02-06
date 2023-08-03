const { Contact } = require('./contact');
const { bodySchema } = require('../joiSchemes/contactBodyScheme');
const { favoriteSchema } = require('../joiSchemes/favoriteBodySchema');


const listContacts = async (req, res, next) => {
	try {
		const contacts = await Contact.find();
		res.json(contacts);
	} catch (error) {
		next(error);
	}
};


const getContactById = async (req, res, next) => {
	try {
		const contact = await Contact.findById(req.params.id);

		if (!contact) {
			throw { status: 404, message: 'Not found' };
		}

		res.json(contact);
	} catch (error) {
		next(error);
	}
};


const addContact = async (req, res, next) => {
	try {
		const { error } = await bodySchema.validate(req.body);

		if (error) {
			throw { status: 400, message: 'missing required field' };
		}

		const contact = await Contact.create(req.body);
		res.status(201).json(contact);
	} catch (error) {
		next(error);
	}
};


const removeContact = async (req, res, next) => {
	try {
		const deletedContact = await Contact.findByIdAndDelete(req.params.id);

		if (!deletedContact) {
			throw { status: 404, message: 'Not found' };
		}

		res.json({ message: 'contact deleted' });
	} catch (error) {
		next(error);
	}
};


const updateContact = async (req, res, next) => {
	try {
		const { error } = await bodySchema.validate(req.body);
		console.log(error);
		if (error) {
			throw { status: 400, message: 'missing required name field' };
		}

		const updatedContact = await Contact.findByIdAndUpdate(
			req.params.id,
			req.body
		);

		if (!updatedContact) {
			throw { status: 404, message: 'Not found' };
		}

		res.json(updateContact);
	} catch (error) {
		next(error);
	}
};


const updateStatusContact = async (req, res, next) => {
	try {
		const { error } = await favoriteSchema.validate(req.body);

		if (error) {
			throw { status: 400, message: 'missing field favorite' };
		}

		const updatedContact = await Contact.findByIdAndUpdate(
			req.params.id,
			req.body
		);

		if (!updatedContact) {
			throw { status: 404, message: 'Not found' };
    }

    updatedContact.favorite = !updatedContact.favorite;

    console.log(updatedContact);
		res.json(updatedContact);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
	updateStatusContact,
};