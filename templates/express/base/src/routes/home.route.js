import { getHome } from './../controllers/home.controller<%=!useTypescript ? ".js" : "" %>';
import express, { Router } from 'express';

const router <%=useTypescript ? ": Router " : "" %> = express.Router();
// POST /users/token
router.get('/', getHome);

export default router;
