const dotenv = require('dotenv');
dotenv.config({ path: 'ini.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { seedMotivationsIfEmpty } = require("./services/mainService");

const  authController  = require('./controllers/authController');
const  userController  = require('./controllers/userController');
const  taskController  = require('./controllers/taskController');
const mainController = require('./controllers/mainController');

const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
  credentials:true
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

seedMotivationsIfEmpty();

app.post('/api/register', authController.register);
app.post('/api/login', authController.login);
app.get('/api/getLevelXp',userController.getLvlXp);
app.post('/api/updateLevelXp',userController.updateLevelXp);
app.get('/api/getDailyTask',taskController.getDailyTasks);
app.patch('/api/tasks/:id/complete', taskController.setTask);
app.post('/api/logout',authController.logout);
app.post('/api/addTask',taskController.addTasks);
app.get('/api/getYourTask',taskController.getYourTask);
app.get('/api/getMotivation',mainController.getMotivations);
app.get('/api/getTopUsers',userController.getTopPlayers);


