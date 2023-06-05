import request, { SuperAgentTest } from 'supertest';

import { startApp, closeApp, syncDatabase, app } from '../../app';
import { AuthState, User, UserType } from '../../model/user.model';
import { AddAccountState, ChangePassowrdState } from '../../controller/user.controller';

let agent: SuperAgentTest;

//start app
beforeAll(async () => {
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

});
