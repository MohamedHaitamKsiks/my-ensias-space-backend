import request, { SuperAgentTest } from 'supertest';
import { startApp, closeApp, syncDatabase, app } from '../../app';
import { AuthState, User, UserType } from '../../model/user.model';
import { AddAccountState, ChangePassowrdState } from '../../controller/user.controller';
import { Etudiant } from '../../model/etudiant.model';
import { Classe } from '../../model/classe.model';

let agent: SuperAgentTest;
let user: User;
let etudiant: Etudiant;

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

    etudiant = await Etudiant.create({
        nom: "Ksiks",
        prenom: "Mohamed Haitam",
        cin: "EEchi7aja",
        phone: "0708038587",
        userId: user.id
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

describe('Test Classe API', () => {

    let testClasse: Classe | null;

    it('can add classe', async () => {
        
        const response = await agent.post('/classe/add')
        .send({
            nom: "1A GL"
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTruthy();
        testClasse = await Classe.findByPk(response.body.id);
        expect(testClasse).toBeTruthy();
        
    });

    it('can get classes', async () => {
        const response = await agent.get('/classe/');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('can get classe', async () => {
        const response = await agent.get(`/classe/${ testClasse?.id }`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTruthy();
        expect(response.body).toEqual(await testClasse?.getClasseInterface());
    });

    it('can edit classe', async () => {

        const response = await agent.post(`/classe/edit/${ testClasse?.id }`)
            .send({
                nom: "2A GL"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTruthy();

        testClasse = await Classe.findByPk(testClasse?.id);
        expect(testClasse?.nom).toEqual("2A GL"); 
    });

    it('can add etudiant',async () => {
        const response = await agent.post(`/classe/etudiant/add/${testClasse?.id}`)
        .send({
            etudiantId: etudiant.id
        });

        expect(response.statusCode).toBe(200);
        //update etudiant
        await etudiant.reload();
        expect(testClasse?.hasEtudiant(etudiant)).toBeTruthy();
    });

    it('can get etudiants', async () => {
        const response = await agent.get(`/classe/etudiant/${testClasse?.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('can set delegue', async () => {
        const response = await agent.post(`/classe/delegue/${testClasse?.id}`)
            .send({
                etudiantId: etudiant.id
            });

        expect(response.statusCode).toBe(200);
        //update etudiant
        await etudiant.reload();
        expect((await testClasse?.getEtudiantDelegue())?.id).toBe(etudiant.id);
    });


    it('can get delegue', async () => {
        const response = await agent.get(`/classe/delegue/${testClasse?.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(etudiant.id);
    });

    it('can delete etudiants', async () => {
        const response = await agent.post(`/classe/etudiant/delete/${testClasse?.id}`)
        .send({
            etudiantId: etudiant.id
        });
        expect(response.statusCode).toBe(200);
        expect((await testClasse?.getEtudiants())?.length).toBe(0);
        expect((await Etudiant.findByPk(etudiant.id))).toBeTruthy();
    });
});
