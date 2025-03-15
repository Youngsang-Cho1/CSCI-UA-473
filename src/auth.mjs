import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const User = mongoose.model('User');

const startAuthenticatedSession = (req, user) => {
  return new Promise((fulfill, reject) => {
    req.session.regenerate((err) => {
      if (!err) {
        req.session.user = user; 
        fulfill(user);
      } else {
        reject(err);
      }
    });
  });
};

const endAuthenticatedSession = req => {
  return new Promise((fulfill, reject) => {
    req.session.destroy(err => err ? reject(err) : fulfill(null));
  });
};


const register = async (username, email, password) => {
  if (username.length < 8 || password.length < 8) {
    throw { message: 'USERNAME PASSWORD TOO SHORT' };
}
  const usernameExist = await User.findOne({ username });
  if (!usernameExist) {
    throw { message: 'USERNAME ALREADY EXISTS' };
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User ({username, email, password: hashedPassword});
  await user.save();
  return user;
};

const login = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw { message: 'USER NOT FOUND' };
  }
  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    throw{ message: "PASSWORDS DO NOT MATCH" }
  }
  return user;
};

export  {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login
};
