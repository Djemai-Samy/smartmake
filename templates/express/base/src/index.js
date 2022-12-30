import express from 'express';
import home from './routes/home.route';
//Server initialization
const server = express();

//Routes
server.use('/', home);

//Server start
server.listen(3000, () => {
	console.log("<%= text.t('express.server.ready') %>");
});
