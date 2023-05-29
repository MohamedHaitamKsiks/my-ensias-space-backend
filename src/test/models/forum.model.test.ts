import { sequelize } from "../../database/connection";
import { syncDatabase } from "../../app";
import { User, UserType } from "../../model/user.model";
import { Etudiant } from "../../model/etudiant.model";
import { Forum } from "../../model/forum/forum.mode";
import { Poste } from "../../model/forum/post.model";
import { Permission } from "../../model/forum/acces.model";

beforeAll(async () => {
    await syncDatabase();
});

afterAll(async () => {
    await sequelize.close();
});

//jest tests
describe('Forum Model', () => {
    
    let testEtudiant: Etudiant;
    let otherEtudiant: Etudiant;

    it('create etudiants', async () => {
        //user
        const testUser = await User.create({
            email: "haitamksiks2001@gmail.com",
            password: "123456789",
            type: UserType.ETUDIANT
        });

        testEtudiant = await Etudiant.create({
            nom: "Ksiks",
            prenom: "Mohamed Haitam",
            cin: "EEchi7aja",
            phone: "0708038587",
            userId: testUser.id
        }); 
        //check etudiant has been created
        expect(testEtudiant.id).not.toBe(undefined);
        //other etudiant
        //user
        const otherTestUser = await User.create({
            email: "haitamksiks@gmail.com",
            password: "123456789",
            type: UserType.ETUDIANT
        });

        otherEtudiant = await Etudiant.create({
            nom: "Ksiks",
            prenom: "Mohamed Haitam",
            cin: "EEchi7aja",
            phone: "0708038587",
            userId: otherTestUser.id
        });
        //check etudiant has been created
        expect(otherEtudiant.id).not.toBe(undefined);
    });

    let testForum: Forum;
    
    it('create Forum', async () => {
        const desciptionPoste = await Poste.create({
            texte: "print('Hello World!')"
        });
        testForum = await testEtudiant.createForum("Hello World!", desciptionPoste);
        expect(testForum.id).not.toBe(undefined);
        expect((await testForum.getAccesOf(testEtudiant))?.isAdmin()).toBe(true);
        expect((await testEtudiant.readForum(testForum))?.length).toBe(1);
    });

    it('poste on forum with no access', async ()=> {
        //no access try to poste
        const poste = await Poste.create({
            texte: "Hi everyone!"
        });
        const posted = await otherEtudiant.postInForum(testForum, poste);
        expect(posted).toBe(false);
        expect((await Poste.findByPk(poste.id))).toBe(null);
    });

    it('poste on forum with access', async () => {
        //no access try to poste
        const poste = await Poste.create({
            texte: "Hi everyone!"
        });
        const posted = await testEtudiant.postInForum(testForum, poste);
        expect(posted).toBe(true);
        expect((await Poste.findByPk(poste.id))).not.toBe(null);
    });

    it('add access', async () => {
        const accesDone = await testEtudiant.setAccesToForum(testForum, otherEtudiant, Permission.LIRE | Permission.ECRIRE);
        expect(accesDone).toBe(true);
        const acces = await testForum.getAccesOf(otherEtudiant);
        expect(acces?.permission).toBe(Permission.ECRIRE | Permission.LIRE);
    });

    it('re poste on forum with new given access', async () => {
        //no access try to poste
        const poste = await Poste.create({
            texte: "Hi everyone!"
        });
        const posted = await otherEtudiant.postInForum(testForum, poste);
        expect(posted).toBe(true);
        expect((await Poste.findByPk(poste.id))).not.toBe(null);
        expect((await otherEtudiant.readForum(testForum))?.length).toBe(3);
    });

    it('close forum',async () => {
        const closed = await testEtudiant.closeForum(testForum);
        expect(closed).toBe(true);
    }); 

    it('poste on closed forum', async () => {
        //no access try to poste
        const poste = await Poste.create({
            texte: "Hi everyone!"
        });
        const posted = await otherEtudiant.postInForum(testForum, poste);
        expect(posted).toBe(false);
    });

});