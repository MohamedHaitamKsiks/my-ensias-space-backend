import exp from "constants";
import { sequelize } from "../../database/connection";
import { AuthState, User, UserInterface, UserType } from "../../model/user.model";

beforeAll(async () => {
    await sequelize.drop();
    await User.sync({ force: true });
});

afterAll(async () => {
    sequelize.close();
});

//jest tests
describe('User Model', () => {

    //test user
    let testUser: User;

    //user creation
    it('create user', async () => {
        //create user
        testUser = await User.create({
            email: 'haitamksiks2001@gmail.com',
            password: 'password',
            type: UserType.ETUDIANT
        });
        expect(testUser).not.toBe(null);
        expect(testUser.email).toEqual('haitamksiks2001@gmail.com')
    });

    //check interface
    it('check user interface', () => {
        let expectedIUser :UserInterface = {
            id: testUser.id,
            email: testUser.email,
            type: testUser.type,
            typeName: testUser.getTypeName()
        };  
        console.log(expectedIUser);
        expect(testUser.getUserInterface()).toEqual(expectedIUser);
    });

    //user authentification
    //wrong email
    it('authentificate wrong email', async() => {
        let auth = await User.authentificate('something@email.smt', 'password');
        expect(auth.state).toEqual(AuthState.USER_NOT_FOUND);
    });

    //wrong password
    it('authentificate wrong password', async() => {
        let auth = await User.authentificate('haitamksiks2001@gmail.com', 'other password');
        expect(auth.state).toEqual(AuthState.PASSWORD_INCORRECT);
    });

    //correct auth
    it('authentificate valid user', async() => {
        let auth = await User.authentificate('haitamksiks2001@gmail.com', 'password');
        expect(auth.state).toEqual(AuthState.VALID);
        expect(auth.user).not.toBe(undefined);
        if (auth.user) {
            expect(auth.user.id).toEqual(testUser.id);
        }
    });

});