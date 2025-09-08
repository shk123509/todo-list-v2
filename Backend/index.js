const connectToMongo = require('./db');
var cors = require('cors')
const express = require('express');
const port = 5000;

connectToMongo();

const app = express();
app.use(cors())
app.use(express.json());

app.use("/api/auth", require("./router/auth"));
app.use("/api/notes", require("./router/notes"));

app.listen(port, () => { 
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
