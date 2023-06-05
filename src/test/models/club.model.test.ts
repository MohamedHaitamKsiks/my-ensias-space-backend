import { sequelize } from "../../database/connection";
import { User, UserType } from "../../model/user.model";
import { Etudiant } from "../../model/etudiant.model";
import { syncDatabase } from "../../app";
import { Club } from "../../model/club.model";

beforeAll(async () => {
    await syncDatabase();
});

afterAll(async () => {
    await sequelize.close();
});

//jest tests
describe('Club Model', () => {

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
        //get user
        const user = await testEtudiant.getUser();
        expect(user.id).toEqual(testEtudiant.userId);
        expect(user.email).toEqual("haitamksiks2001@gmail.com");
    });

    let club: Club;
    it('create club', async () => {
        club = await Club.create({
            name: "Some Club",
            description: "Best club"
        });
        expect(club.id).toBeTruthy();
    });

    

});