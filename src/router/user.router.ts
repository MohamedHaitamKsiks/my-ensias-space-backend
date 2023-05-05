import express, { Request, Response } from 'express';
import { AuthState, UserInterface } from '../model/user.model';
import { userController } from '../controller/user.controller';
import { userMiddleware } from '../middleware/user.middleware';

//create router
export const userRouter = express.Router();

//test request
userRouter.get('/', (req: Request, res: Response) => {
    res.statusCode = 200;
    res.send({
        value: "ok"
    });
});

//login
userRouter.post('/login', userController.login);

//get user connected info
userRouter.get('/info', userMiddleware.verifyUserLogged,  userController.info )

//change password
userRouter.post('/changepassword', userMiddleware.verifyUserLogged, userController.changePassowrd);

//logout
userRouter.post('/logout', userController.logout);

//add account
userRouter.post('/add', userMiddleware.verifyUserLogged, userController.add);

