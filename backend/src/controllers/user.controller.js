const db = require('../models');
const User = db.user;
const bcrypt = require('bcryptjs');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] } // Exclude the password from the response
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || "Error occurred while retrieving user profile" });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update user information
    if (req.body.name) {
      user.name = req.body.name;
    }
    
    if (req.body.email) {
      // Check if email already exists (for another user)
      const existingUser = await User.findOne({ 
        where: { 
          email: req.body.email,
          id: { [db.Sequelize.Op.ne]: req.userId } // Exclude current user
        } 
      });
      
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      user.email = req.body.email;
    }
    
    if (req.body.password) {
      // Hash the new password
      user.password = bcrypt.hashSync(req.body.password, 8);
    }
    
    // Save the updated user
    await user.save();
    
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error occurred while updating user profile" });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Delete the user
    await user.destroy();
    
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error occurred while deleting user account" });
  }
};

// Get all users (for admin purposes)
exports.getAllUsers = async (req, res) => {
  try {
    console.log('getAllUsers called, req.userId:', req.userId);
    console.log('User model:', User);
    
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // Exclude passwords for security
      order: [['createdAt', 'DESC']] // Show newest users first
    });
    
    console.log('Users found:', users.length);
    console.log('Users data:', users);
    
    // Map users to ensure all required fields are present
    const mappedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'Utilisateur',
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date()
    }));
    
    res.status(200).json(mappedUsers);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: error.message || "Error occurred while retrieving users" });
  }
};
