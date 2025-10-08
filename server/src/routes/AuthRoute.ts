import { Router,Request,Response } from 'express';
import { DataSave, deleteUser, findUser, login, register, updateUser } from '../controllers/userController';

const router=Router()
router.post('/register',register)
router.post('/login',login)
router.post('/save',DataSave)
router.get('/findUser',findUser)
router.delete("/deleteUser/:id",deleteUser)
router.patch('/updateUser/:id',updateUser)

export default router