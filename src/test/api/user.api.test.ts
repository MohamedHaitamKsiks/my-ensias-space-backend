import request, { SuperAgentTest } from 'supertest';

import { startApp, closeApp, syncDatabase, app } from '../../app';
import { AuthState, User, UserType } from '../../model/user.model';
import { AddAccountState, ChangePassowrdState } from '../../controller/user.controller';

let agent: SuperAgentTest;

//start app
beforeAll(async() => {
    agent = request.agent(app);
    await syncDatabase();
    await startApp();
});

//close app at the end
afterAll(async () => {
    await closeApp();
});

describe('Test User API', () => {
    //test user
    let testUser: User;
    let cookie: string;

    //test hello world api
    it('test api', async () => {
        //GET /user expect Hello World!
        const response = await agent.get('/user');

        expect(response.statusCode).toBe(200);
        expect(response.body.value).toEqual('ok');
    });

    //create test user to test api
    it('create test user',async () => {
        //create test user
        testUser = await User.create({
            email: 'haitamksiks2001@gmail.com',
            password: 'password',
            type: UserType.ADMIN
        });
        expect(testUser).not.toBe(null);
    });
    

    
    //login test
    it('login', async () => {
        //POST /user/login expect connection
        const response = await agent.post('/user/login')
        .send({
            email: 'haitamksiks2001@gmail.com',
            password: 'password'
        });

        expect(response.statusCode).toBe(200);
        
        if(response.body) {
            const loginResponse = response.body;
            expect(loginResponse.state).toEqual(AuthState.VALID);
            expect(loginResponse.user).toEqual(testUser.getUserInterface());
        }

    });

    //get user info
    it('get user', async () => {
        const response = await agent.get('/user/info');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(testUser.getUserInterface());
    });

    //change user info
    it('change password', async () => {
        const response = await agent.post('/user/changepassword')
        .send({
            oldPassword: "password",
            newPassword: "123456789"
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.state).toEqual(ChangePassowrdState.DONE);

        //test new password
        const responseConnect = await agent.post('/user/login')
            .send({
                email: 'haitamksiks2001@gmail.com',
                password: '123456789'
            });
        expect(responseConnect.body.state).toEqual(AuthState.VALID);
    });

    //logout
    it('logout', async () => {
        //
        const response = await agent.post('/user/logout');
        expect(response.statusCode).toBe(200);

        //test if logout is working
        const responseInfo = await agent.get('/user/info');
        expect(responseInfo.body.logged).not.toBe(undefined);

    });

    //add account
    it('add account', async () => {
        //connect
        await agent.post('/user/login')
            .send({
                email: 'haitamksiks2001@gmail.com',
                password: '123456789'
            });

        //add account
        const response = await agent.post('/user/add')
            .send({
                email: 'katelyn.kunze@ethereal.email',
                type: UserType.ADMIN
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.state).toEqual(AddAccountState.DONE);

        //logout
        await agent.post('/user/logout');
        
        //login to new account
        //test new password
        const newAccountPassword = response.body.password;
        const responseLogin = await agent.post('/user/login')
            .send({
                email: 'katelyn.kunze@ethereal.email',
                password: newAccountPassword
            });
        expect(responseLogin.body.state).toEqual(AuthState.VALID);
            
        //test if logout is working
        const responseInfo = await agent.get('/user/info');
        expect(responseInfo.body.email).toEqual('katelyn.kunze@ethereal.email');

        
    });
    
    //test existing email
    it('add account error',async () => {
        //add account
        const response = await agent.post('/user/add')
            .send({
                email: 'katelyn.kunze@ethereal.email',
                type: UserType.ADMIN
            });  

        expect(response.body.state).toEqual(AddAccountState.EMAIL_ALREADY_EXISTS);
    });


});
