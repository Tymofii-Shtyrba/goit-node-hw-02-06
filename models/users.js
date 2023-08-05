const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const fs = require('fs/promises');
const path = require('path');
const Jimp = require('jimp');
const { User } = require('./user');
const { bodySchema } = require('../joiSchemes/userBodyScheme');
const { v4: uuidv4 } = require('uuid');
const { letter } = require('../letter');
const sgMail = require('@sendgrid/mail');

const { SECRET_KEY, SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const register = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const { error } = await bodySchema.validate(req.body);

		if (error) {
			throw { status: 400, message: 'missing require field' };
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw { status: 409, message: 'Email in use' };
		}

		const verificationToken = uuidv4();
		const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
		const avatarURL = gravatar.url(email, { s: '250', r: 'pg', d: 'retro' });
		await sgMail.send(letter(email, verificationToken));
		const newUser = await User.create({
			email,
			password: hashPassword,
			avatarURL,
			verificationToken,
		});
		res
			.status(201)
			.json({ user: { email, subscription: newUser.subscription } });
	} catch (error) {
		next(error);
	}
};

const login = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const { error } = await bodySchema.validate(req.body);

		if (error) {
			throw { status: 400, message: 'missing required field' };
		}

		const existingUser = await User.findOne({ email });

		if (!existingUser) {
			throw { status: 401, message: 'Email or password is wrong' };
		}

		const passwordCompare = await bcrypt.compare(
			password,
			existingUser.password
		);

		if (!passwordCompare) {
			throw { staus: 401, message: 'Email or password is wrong' };
		}

		const payload = {
			id: existingUser._id,
		};

		const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
		await User.findByIdAndUpdate(existingUser._id, { token });

		res.json({
			token,
			user: { email, subscription: existingUser.subscription },
		});
	} catch (error) {
		next(error);
	}
};

const logout = async (req, res, next) => {
	const userToLogout = await User.findById(req.user._id);

	try {
		if (!userToLogout) {
			throw { status: 401, message: 'Not authorized' };
		}

		await User.findByIdAndUpdate(req.user._id, { token: null });
		res.status(204).json({});
	} catch (error) {
		next(error);
	}
};

const current = async (req, res, next) => {
	try {
		const currentUser = await User.findById(req.user._id);

		if (!currentUser) {
			throw { status: 401, message: 'Not authorized' };
		}

		res.json(currentUser);
	} catch (error) {
		next(error);
	}
};

const changeAvatar = async (req, res, next) => {
	const { path: tempUpload, originalname } = req.file;
	const { _id } = req.user;
	const newName = _id + originalname;

	const resultUpload = path.join(
		__dirname,
		'../',
		'public',
		'avatars',
		newName
	);

	try {
		await Jimp.read(tempUpload).then((image) =>
			image.cover(250, 250).write(resultUpload)
		);
		await fs.unlink(tempUpload);

		const avatarURL = path.join('avatars', newName);

		await User.findByIdAndUpdate(_id, { avatarURL });
		res.json({ avatarURL });
	} catch (error) {
		await fs.unlink(tempUpload);
	}
};

const verification = async (req, res, next) => {
	const { verificationToken } = req.params;

	try {
		const userWithToken = await User.findOne({ verificationToken });

		if (!userWithToken) {
			throw { status: 404, message: 'User not found' };
		}

		await User.findByIdAndUpdate(userWithToken._id, {
			verificationToken: null,
			verify: true,
		});
		res.json({ message: 'Verification successful' });
	} catch (error) {
		next(error);
	}
};

const reverification = async (req, res, next) => {
	const { email } = req.body;

	try {
		if (!email) {
			console.log('no email');
			throw { status: 400, message: 'missing required field email' };
		}

		const { verify, verificationToken} = await User.findOne({ email });

		if (verify) {
			console.log('verify is true');
			throw { status: 400, message: 'Verification has already been passed' };
		}

		await sgMail.send(letter(email, verificationToken));
		res.json({
			"message": "Verification email sent"
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	register,
	login,
	logout,
	current,
	changeAvatar,
	verification,
	reverification,
};
