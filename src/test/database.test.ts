import { sequelize } from "../database/connection";

afterAll(async () => {
    sequelize.close();
});

//test database is connected
async function databaseIsConnected() {
    try {
        await sequelize.authenticate();
        return true;
    } catch(err) {
        return false;
    }
}

//jest tests
describe('Database Connection', () => {

    //test connection
    it('is database connected', async () => {
        
        await expect(databaseIsConnected()).resolves.toBe(true);    

    });

});