const jwt = require('jsonwebtoken');

const { User } = require('../models/user');
const { SECRET_KEY } = process.env;

const auth = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bereare, token] = authorization.split(' ');
  if (!bereare) {
    next({ status: 401, message: 'Not authourized' })
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (user.token ==! token) {
      throw {};
    } 

    req.user = user;
    next()
  } catch (error) {
    next({ status: 401, message: 'Not authourized' });
  }
}


module.exports = {
  auth,
}