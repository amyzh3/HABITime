// server/index.js
const express = require('express');
const app = express();
const PORT = 8080;

const cors = require('cors');
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('backend is running');
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});