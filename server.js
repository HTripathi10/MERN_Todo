const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const toDoRoutes = require('./routes/ToDoRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.DB_URL).then((result) => {
    console.log("DB connected successfully!");
}).catch(err =>{
    console.log(err);
    
})


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.use(express.static(path.join(__dirname,'client/build')));

// Route handlers
app.use('/api', authRoutes);
app.use('/api/todo', toDoRoutes);
app.use('/api/password-reset', passwordResetRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT,() => {
    console.log(`Server started at port ${PORT}`);
    
})