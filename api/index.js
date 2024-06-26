const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes');
require('./db/conn');
app.use(cors());
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
	res.json({ message: 'Hello from Express with CORS enabled!' });
});

app.use('/api', routes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});