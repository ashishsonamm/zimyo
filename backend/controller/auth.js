const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { User } = require('../models');

const RequestHandler = require("../utils/RequestHandler");
const requestHandler = new RequestHandler();

exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return requestHandler.sendError(
            res,
            "User already exists",
            400
          )();
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role
      });

      return requestHandler.sendSuccess(
        res,
        `User registered successfully`,
        201
    )({userId: newUser.id});
  
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
  }

  exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return requestHandler.sendError(
            res,
            "Invalid credentials",
            401
          )();
      }
  
      // Check if password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return requestHandler.sendError(
            res,
            "Invalid credentials",
            401
          )();
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return requestHandler.sendSuccess(
        res,
        `Logged in successfully`,
        200
    )({ token, userId: user.id, role: user.role });
  
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
  }