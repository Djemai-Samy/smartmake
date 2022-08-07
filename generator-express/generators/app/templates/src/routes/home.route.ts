import { getHome } from './../controllers/home.controller';
import express, { Router } from 'express';

const router: Router = express.Router();
// POST /users/token
router.get('/', getHome);

export default router;
