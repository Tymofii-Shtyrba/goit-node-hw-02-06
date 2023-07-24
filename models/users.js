const { User } = require('./user');
const bcrypt = require('bcryptjs');
const { response } = require('express');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

const register = async (body) => {
	const { email, password } = body;

	const user = await User.findOne({ email });

	if (user) {
		throw { status: 409, message: 'Email in use' };
	}

	const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
	const result = User.create({ email, password: hashPassword });
	return result;
};

const login = async (body) => {
	const { email, password } = body;

	const user = await User.findOne({ email });

	if (!user) {
		throw { status: 401, message: 'Email or password is wrong' };
	}

	const passCompare = await bcrypt.compare(password, user.password);

	if (!passCompare) {
		throw { staus: 401, message: 'Email or password is wrong' };
	}

	const payload = {
		id: user._id,
	};

	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
	const userToUpdate = await User.findByIdAndUpdate(user._id, { token });

	return { token: token, user: { email, subscription: user.subscription } };
};

const logout = async (id) => {
	const user = await User.findById(id);

	if (!user) {
		throw { status: 401, messgae: 'Not authorized' };
	}

  const newUser = await User.findByIdAndUpdate(id, { token: null });
  return newUser;
};

const current = async (id) => {
  const user = await User.findById(id);

  if (!user) {
	  throw { status: 401, messgae: 'Not authorized' };
  }
  
  return {email: user.email, subscription: user.subscription};
}

module.exports = {
	register,
	login,
  logout,
  current,
};
