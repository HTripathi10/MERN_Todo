const mongoose = require('mongoose');
const {Schema} = mongoose;

const todoSchema = new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    status:{
        type:String,
        enum:['ACTIVE','IN_PROGRESS','COMPLETE','EXPIRED'],
        default:'ACTIVE',
        required:true
    },
    deadline:{type:Date,required:true},
    isCompleted:{type:Boolean,required:true},
    completedOn:String,
    createdBy:{
        ref:"User",
        type:Schema.ObjectId
    }
},{
    timestamps:true
});

const ToDo = mongoose.model("ToDo",todoSchema);

module.exports = ToDo;