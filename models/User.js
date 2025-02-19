const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName:String,
    lastName:String,
    username:{type:String,required:true},
    password:{type:String,required:true}
});

userSchema.pre("save", async function(next) {
  const user = this;
  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password,this.password);
}

const User = mongoose.model("User",userSchema);

module.exports = User;