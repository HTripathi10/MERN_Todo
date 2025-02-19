const bcrypt = require('bcrypt');
const User = require('../models/User');
const { getErrorMessage } = require('../util/serverErrorHandler');

const resetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Use the same hashing approach as in User model
    // Directly set the password to trigger the pre-save hook
    user.password = newPassword;
    const savedUser = await user.save();
    
    // Verify the hash was properly stored
    const verifyHash = await bcrypt.compare(newPassword, savedUser.password);
    if (!verifyHash) {
      throw new Error('Password hash verification failed');
    }
    
    if (!savedUser) {
      throw new Error('Failed to save updated password');
    }
    console.log('Password updated successfully for user:', savedUser.username);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

module.exports = {
  resetPassword
};
