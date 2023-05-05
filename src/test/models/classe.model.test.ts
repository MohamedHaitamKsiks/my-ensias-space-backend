import { sequelize } from "../../database/connection";
import { User, UserType } from "../../model/user.model";
import { Etudiant } from "../../model/etudiant.model";
import { syncDatabase } from "../../app";
import { Classe } from "../../model/classe.model";
import { Delegue } from "../../model/role/delegue.model";
import { Role } from "../../model/role/role.model";

beforeAll(async () => {
    await syncDatabase();
});

afterAll(async () => {
    await sequelize.close();
});

//jest tests
describe('Classe Model', () => {

    let testEtudiant: Etudiant;

    it('create etudiant', async () => {
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
    });

    let classe: Classe;

    it('create classe', async () => {
        classe = await Classe.create({
            nom: "2A GL"
        });
        expect(classe.id).not.toEqual(undefined);
    });

    it('add student to classe', async () => {
        //add test etudiant to classe
        await classe.addEtudiant(testEtudiant);
        //test if classe has this user
        const classeHasEtudiant = await classe.hasEtudiant(testEtudiant);
        expect(classeHasEtudiant).toBe(true);
    });

    it('get students from classe',async () => {
        const etudiants = await classe.getEtudiants();
        expect(etudiants.length).toBe(1); 
    });

   

    it('add delegue as a role',async () => {
        
    });


});