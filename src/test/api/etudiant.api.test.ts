import request, { SuperAgentTest } from 'supertest';
import { startApp, closeApp, syncDatabase, app } from '../../app';
import { AuthState, User, UserType } from '../../model/user.model';
import { AddAccountState, ChangePassowrdState } from '../../controller/user.controller';
import { Etudiant } from '../../model/etudiant.model';

let agent: SuperAgentTest;
let user: User;

//start app
beforeAll(async () => {
    agent = request.agent(app);
    await syncDatabase();
    await startApp();

    user = await User.create({
        email: 'haitamksiks2001@gmail.com',
        password: 'password',
        type: UserType.ADMIN
    });

    await agent.post('/user/login')
    .send({
        email: 'haitamksiks2001@gmail.com',
        password: 'password'
    });
});

//close app at the end
afterAll(async () => {
    await closeApp();
});

describe('Test Etudiant API', () => {
    let testEtudiant: Etudiant | null;

    //test hello world api
    it('can add etudiant', async () => {
        const response = await agent.post('/etudiant/add')
        .send({
            nom: "Ksiks",
            prenom: "Mohamed Haitam",
            cin: "EEchi7aja",
            phone: "0708038587",
            userId: user.id
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTruthy();
        testEtudiant = await Etudiant.findByPk(response.body.id);
        expect(testEtudiant).toBeTruthy();
    });

    it('can get etudiants', async () => {
        const response = await agent.get('/etudiant/');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTruthy();
        expect(response.body.length).toBe(1);
    });

    it('can get etudiant', async () => {
        const response = await agent.get('/etudiant/4648654');
        expect(response.statusCode).toBe(404);
    });

    it('can edit etudiant', async () => {
        const response = await agent.post(`/etudiant/edit/${ testEtudiant?.id }`)
            .send({
                cin: "EEchi7ajakhra",
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTruthy();
        //re-get testEtudiant
        testEtudiant = await Etudiant.findByPk(response.body.id);
        expect(testEtudiant?.cin).toBe("EEchi7ajakhra");
    });

});
