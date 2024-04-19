const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes');
const { connectToDatabase } = require('./db/conn');
app.use(cors());
connectToDatabase();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.json({ message: 'Hello from Express with CORS enabled!' });
});

app.use('/api', routes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});