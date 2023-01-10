import express from 'express';
import home from './routes/home.route<%=!useTypescript ? ".js" : "" %>';
import path from 'path';
//Server initialization
const server = express();

const port = <%= port %>;

//Routes
server.use('/api/', home);

<%_if(services.react){_%>
// Serve the static files from the React app
server.use(express.static(path.join(__dirname, "public")));

// Serve the react app
server.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public', 'index.html'));
});
<%_}_%>

//Server start
server.listen(<%= port %>, () => {
	console.log(`<%= text.t('common.server.ready') %> : ${port}`);
});
