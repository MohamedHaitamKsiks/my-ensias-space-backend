import { Request, Response } from "express";
import { User, UserInterface, AuthState, AuthResponse, UserType } from "../model/user.model";
import randomstring from "randomstring"

//login response
export interface LoginResponse {
    user?: UserInterface,
    state: AuthState
    
};

//change password resposnse
export enum ChangePassowrdState {
    DONE,
    WRONG_OLD_PASSWORD,
    ERROR
}

export interface ChangePassowrdResponse {
    state: ChangePassowrdState;
};

//add account response
export enum AddAccountState {
    DONE,
    NOT_ADMIN,
    EMAIL_ALREADY_EXISTS,
    EMAIL_NOT_FOUND,
    TYPE_NOT_FOUND
};

export interface AddAccountResponse {
    password?: string,
    state: AddAccountState
};

//user controller
export const userController = {
    //login
    async login(req: Request, res: Response) {

        //response
        let loginResponse: LoginResponse = {
            state: AuthState.VALID
        }
        //validate requesst body
        const body = req.body;
        //check email exists
        if (body.email == undefined) {
            loginResponse.state = AuthState.USER_NOT_FOUND,
            res.send(loginResponse);
            return;
        }
        //check password exists 
        if (body.password == undefined) {
            loginResponse.state = AuthState.PASSWORD_INCORRECT,
            res.send(loginResponse);
            return;
        }

        //authentificate
        const auth: AuthResponse = await User.authentificate(body.email, body.password);
        //set login response
        loginResponse.state = auth.state;
        if (loginResponse.state == AuthState.VALID) {
            //create session
            req.session.userId = auth.user?.id;
            loginResponse.user = auth.user?.getUserInterface();
        }

        res.statusCode = 200;
        res.send(loginResponse);
    },
    //logout
    async logout(req: Request, res: Response) {
        //delete session
        req.session.userId = undefined;
        //status code
        res.statusCode = 200;
        res.send();
    },
    //get user info
    async info(req: Request, res: Response) {
        //get id
        let userId = req.session.userId;

        //user info
        const user = await User.findByPk(userId);
        const userInfo = user?.getUserInterface();

        //send
        res.statusCode = 200;
        res.send(userInfo);
    },
    //change password
    async changePassowrd(req: Request, res: Response) {
        let response: ChangePassowrdResponse = {
            state: ChangePassowrdState.DONE
        };

        //get id
        let userId = req.session.userId;

        //get user
        const user = await User.findByPk(userId);
        if (!user){
            response.state = ChangePassowrdState.ERROR;
            res.send(response);
            return;
        };

        //verify old password
        const oldPassword = req.body.oldPassword;
        if (!oldPassword || !user.checkPassowrd(oldPassword)) {
            response.state = ChangePassowrdState.WRONG_OLD_PASSWORD;
            res.send(response);
            return;
        }

        //set new password
        const newPassword = req.body.newPassword;
        //check new password is not null
        if (!newPassword) {
            response.state = ChangePassowrdState.ERROR;
            res.send(response);
            return;
        };
        user.setPassword(newPassword);

        res.statusCode = 200;
        res.send(response);

    },
    //add account
    async add(req: Request, res: Response) {
        //new account response
        const response: AddAccountResponse = {
            state: AddAccountState.DONE
        };

        //check if admin
        const isAdmin = (await User.findByPk(req.session.userId))?.type == UserType.ADMIN;
        if (!isAdmin) {
            response.state = AddAccountState.NOT_ADMIN;
            res.send(response);
            return;
        }

        //email
        const newAccountEmail = req.body.email;
        if (!newAccountEmail) {
            response.state = AddAccountState.EMAIL_NOT_FOUND;
            res.send(response);
            return;
        }
        //check email exists
        const emailExists = (await User.findAll({
            where: {
                email: newAccountEmail
            }
        })).length > 0;
        if (emailExists) {
            response.state = AddAccountState.EMAIL_ALREADY_EXISTS;
            res.send(response);
            return;
        }

        //check type
        const newAccountType = req.body.type;
        if (newAccountType == undefined) {
            response.state = AddAccountState.TYPE_NOT_FOUND;
            res.send(response);
            return;
        }

        //generate password
        const newAccountPassword = randomstring.generate(7);

        //create account
        const newUser = User.create({
            email: newAccountEmail,
            password: newAccountPassword,
            type: newAccountType
        });

        response.password = newAccountPassword;

        res.statusCode = 200;
        res.send(response);
    }

};