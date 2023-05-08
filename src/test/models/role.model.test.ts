import { sequelize } from "../../database/connection";
import { User, UserType } from "../../model/user.model";
import { Etudiant } from "../../model/etudiant.model";
import { syncDatabase } from "../../app";
import { Classe } from "../../model/classe.model";
import { Role } from "../../model/role/role.model";

beforeAll(async () => {
    await syncDatabase();
});

afterAll(async () => {
    await sequelize.close();
});

//jest tests
describe('Role Model', () => {

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

    it('create role as delegue of a classe', async () => {
        const delegue = await Role.createDelegue(classe);
        const deleguesClasse = await delegue.getClasse();
        expect(deleguesClasse.id).toEqual(classe.id);
    });

    it('add roles',async () => {
        const role = await (await classe.getDelegue()).getRole();
        await testEtudiant.addRole(role);
        //test
        expect((await testEtudiant.getRoles()).length).toBe(1);
        expect((await testEtudiant.hasRole(role))).toBe(true);
        expect((await classe.getEtudiantDelegue()).id).toBe(testEtudiant.id);
    });



});