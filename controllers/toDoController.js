const ToDo = require("../models/ToDoList");


exports.createToDo = async (req,res) => {
    try {
        const data = req.body;
        // Set default status if not provided
        if (!data.status) {
            data.status = 'ACTIVE';
        }
        const todo = new ToDo(data);
        const result = await todo.save();
        console.log(result);
        res.status(201).send({message:"Created new task!"});
    } catch (err) {
        console.log(err);
        res.status(err);   
    }
}

exports.getAllToDo = async (req,res) => {
    let {userId} = req.params;

    try {
        // Get all TODOs for the user
        const todos = await ToDo.find({createdBy:userId});
        
        // Check and update status for each TODO
        const updatedTodos = await Promise.all(todos.map(async (todo) => {
            // If deadline has passed and task is not COMPLETE, mark as EXPIRED
            if (todo.deadline && new Date() > todo.deadline && todo.status !== 'COMPLETE') {
                todo.status = 'EXPIRED';
                await todo.save();
            }
            return todo;
        }));

        res.send(updatedTodos);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

exports.updateToDo = async (req,res) => {
    try {
        const {id} = req.params;
        const data = req.body;
        
        // Validate status if provided
        if (data.status && !['ACTIVE','IN_PROGRESS','COMPLETE','EXPIRED'].includes(data.status)) {
            return res.status(400).send({message:"Invalid status value"});
        }

        // If updating to COMPLETE, set isCompleted to true
        if (data.status === 'COMPLETE') {
            data.isCompleted = true;
        }

        const result = await ToDo.findByIdAndUpdate(id,{$set:data},{returnOriginal:false});
        console.log(result);
        res.send({message:"ToDo list Updated!"})
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

exports.deleteToDo = async (req,res) => {
    try {
        const {id} = req.params;
        const result = await ToDo.findByIdAndDelete(id);
        console.log(result);
        res.send({message:"ToDo task Deleted!"});
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}