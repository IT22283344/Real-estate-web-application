import  Express  from "express";
import { signup } from "../controllers/auth.controller";


const router=Express.Router();
router.post('/signup',signup);

export default router;