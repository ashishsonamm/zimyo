const { User } = require('../models'); // Adjust the path as needed

const roleAuth = (roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await User.findByPk(req.user.userId);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (roles.includes(user.role)) {
        next();
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error checking user role", error: error.message });
    }
  };
};

module.exports = roleAuth;