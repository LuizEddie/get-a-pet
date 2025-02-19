const express = require("express");
const cors = require("cors");

const UserRoutes = require('./routes/UserRoutes');
const PetRoutes = require('./routes/PetRoutes');

const app = express();

//Config json response;
app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:12000'}));

//public folder
app.use(express.static("public"));

//Routes
app.use('/users', UserRoutes);
app.use('/pets', PetRoutes);

app.listen(5000);