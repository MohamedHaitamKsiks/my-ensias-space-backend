import request, { SuperAgentTest } from 'supertest';
import { startApp, closeApp, syncDatabase, app } from '../../app';
import { AuthState, User, UserType } from '../../model/user.model';
import { AddAccountState, ChangePassowrdState } from '../../controller/user.controller';
import { Etudiant } from '../../model/etudiant.model';
import { Forum } from '../../model/forum/forum.mode';
import { Poste } from '../../model/forum/post.model';
import { Document } from '../../model/document.model';
import fs from 'fs/promises'


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
    await fs.rm('uploads', {
        recursive: true
    });
    await fs.mkdir('uploads');
    await fs.mkdir('uploads/.tmp');
    await fs.mkdir('uploads/documents');
});

//close app at the end
afterAll(async () => {
    await closeApp();
});
    
describe('Test Forum API', () => {
    let testForum: Forum;

    //test hello world api
    it('can add forum', async () => {
        const response = await agent.post('/forum/add')
        .send({
            sujet: "chi7aja",
        });

        const createdForum = await Forum.findByPk(response.body.id);
        if (createdForum)
            testForum = createdForum;

        expect(response.statusCode).toBe(200);
        expect(createdForum).toBeTruthy();
        expect(createdForum?.sujet).toEqual("chi7aja");

    });

    it('can get forums', async () => {
        const response = await agent.get('/forum/');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('can edit forum', async ()=> {
        const response = await agent.post(`/forum/edit/${ testForum.id }`)
        .send({
            sujet: "chiwzakhra"
        });
        expect(response.statusCode).toBe(200);
        await testForum.reload();
        expect(testForum.sujet).toEqual("chiwzakhra");
    });

    it('can get posts from forum', async () => {
        const response = await agent.get(`/forum/post/${testForum.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    let testPoste: Poste;

    it('can post in forum', async () => {
        //craete document
        const documentId = parseInt( (await agent.post('/document/add')
        .field('Content-Type', 'multipart/form-data')
        .attach('document', 'test/img.jpg')).body.id );
        const document = await Document.findByPk(documentId);
        
        //post
        const response = await agent.post(`/forum/post/add/${testForum.id}`)
        .send({
            texte: "hello everyone",
            documents: [
                document?.id
            ]
        });

        const poste = await Poste.findByPk(response.body.id);
        if (poste)
            testPoste = poste;

        expect(response.statusCode).toBe(200);
        expect(response.body.postedBy.id).toBe(etudiant.id);
        expect((await testForum.getPostes()).length).toBeGreaterThan(1);
        
    });

    it('can edit post ', async () => {
        const response = await agent.post(`/forum/post/edit/${testForum.id}`)
        .send({
            posteId: testPoste.id,
            texte: "goodbye",
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.texte).toBe("goodbye");
    });

    let testDocument: Document | null;

    it('can add document to post', async () => {
        //craete document
        const documentId = parseInt((await agent.post('/document/add')
        .field('Content-Type', 'multipart/form-data')
        .attach('document', 'test/img.jpg')).body.id);
        testDocument = await Document.findByPk(documentId);

        //post
        const response = await agent.post(`/forum/post/document/add/${testForum.id}`)
        .send({
            posteId: testPoste.id,
            documentId: testDocument?.id
        });

        testPoste = await testPoste.reload();
        expect(response.statusCode).toBe(200);
        expect((await testPoste.getDocuments()).length).toBe(2);
    });

    it('can delete document from post', async () => {
        //craete document
        const response = await agent.post(`/document/delete/${ testDocument?.id }`);

        testPoste = await testPoste.reload();
        expect(response.statusCode).toBe(200);
        expect((await testPoste.getDocuments()).length).toBe(1);
    });
});
