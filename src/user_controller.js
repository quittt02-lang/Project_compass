const User = require('./user_module');

const getUsers = async (req, res) => {
  try {
    const allUsers = await User.find().lean();
    res.send(allUsers);
  } catch (error) {
    res.send({ error: "Ошибка при получении: " + error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.send(newUser);
  } catch (error) {
    res.send({ error: "Ошибка при создании: " + error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.body._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      req.body, 
      { new: true, overwrite: true }
    ).lean();

    res.send(updatedUser);
  } catch (error) {
    res.send({ error: "Ошибка при обновлении: " + error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser
};