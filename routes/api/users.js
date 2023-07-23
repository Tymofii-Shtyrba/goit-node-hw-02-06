const router = require('express').Router();
const operations = require('../../models/users');
const { bodySchema } = require('../../joiSchemes/userBodyScheme');
const { auth } = require('../../midlwares/auth');

router.post('/register', async (req, res, next) => {
	try {
		const { error } = await bodySchema.validate(req.body);

		if (error) {
			throw { status: 400, message: 'missing required field' };
		}

		const result = await operations.register(req.body);
		const { email, subscription } = result;
		res.status(201).json({ user: { email, subscription } });
	} catch (error) {
		next(error);
	}
});

router.post('/login', async (req, res, next) => {
	try {
		const { error } = await bodySchema.validate(req.body);
		if (error) {
			throw { status: 400, message: 'missing required field' };
		}

		const result = await operations.login(req.body);
		res.json(result);
	} catch (error) {
		next(error);
	}
});

router.post('/logout', auth, async (req, res, next) => {
	const { _id } = req.user;

	try {
		const result = await operations.logout(_id);

		if (!result) {
			throw { status: 401, message: 'Not authodized' };
		}

		res.status(204).json({});
	} catch (error) {
		next(error);
	}
});

router.get('/current', auth, async (req, res, next) => {
	const { _id } = req.user;

	try {
		const result = await operations.current(_id);
		res.json(result);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
