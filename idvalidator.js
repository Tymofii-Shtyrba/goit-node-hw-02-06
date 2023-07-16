const { isValidObjectId } = require('mongoose');

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    const error = { status: 400, message: 'is not valid id' };
    next(error);
  }
  next();
}

module.exports = isValidId;