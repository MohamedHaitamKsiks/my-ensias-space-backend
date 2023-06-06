import request, { SuperAgentTest } from 'supertest';
import { startApp, closeApp, syncDatabase, app } from '../../app';
import { User, UserType } from '../../model/user.model';
import { Etudiant } from '../../model/etudiant.model';
import fs from 'fs/promises'
import { Document } from '../../model/document.model';

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
        type: UserType.ETUDIANT
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

    //clean tmp
    await fs.rm('uploads/.tmp', {
        recursive: true
    });
    await fs.mkdir('uploads/.tmp');
});

//close app at the end
afterAll(async () => {
    await closeApp();
});

describe('Test Document API', () => {

    let testDocument: Document | null;

    it('can add document', async () => {
        const response = await agent.post('/document/add')
        .field('Content-Type', 'multipart/form-data')
        .attach('document', 'test/img.jpg');

        expect(response.statusCode).toBe(200);
        
        const tmpFolder = await fs.readdir('uploads/.tmp');
        expect(tmpFolder.length).toBe(1);
        expect(response.body.nom).toEqual("img.jpg");

        testDocument = await Document.findByPk(response.body.id);
        expect(testDocument).toBeTruthy();

    });

    it('can get document', async () => {
        const response = await agent.get(`/document/file/${ testDocument?.id }`);

        expect(response.statusCode).toBe(200);
        expect(response.body.length).not.toBeLessThanOrEqual(0)

    });

    it('can delete document', async () => {
        const response = await agent.post(`/document/delete/${testDocument?.id}`);

        expect(response.statusCode).toBe(200);
        const tmpFolder = await fs.readdir('uploads/.tmp');
        expect(tmpFolder.length).toBe(0);
    });

});
