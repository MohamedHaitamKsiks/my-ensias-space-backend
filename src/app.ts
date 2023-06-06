//app
import express, { Request, Response } from 'express';
import session from 'express-session';
import { application } from './config/application.config';
//db
import { sequelize } from './database/connection';
//routers
import { userRouter } from './router/user.router';
import { setupModelRelation } from './model/model';
import { etudiantRouter } from './router/etudiant.router';
import { classeRouter } from './router/classe.router';
import { forumRouter } from './router/forum.router';
import { User } from './model/user.model';
import { Etudiant } from './model/etudiant.model';
import { documentRouter } from './router/document.router';
import { clubController } from './controller/club.controller';
import { clubRouter } from './router/club.router';

//create app
export const app = express();
let server: any;
const port = application.port;

setupModelRelation();

//session data
declare module "express-session" {
    interface SessionData {
        user?: User,
        etudiant?: Etudiant
    }
}

//sync database
export async function syncDatabase() {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.drop();
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
};


//main function
export async function startApp() {

    //add json to express app
    app.use(express.json());

    //add session
    app.use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false
    }));

    //add routes
    app.use('/user', userRouter);
    app.use('/etudiant', etudiantRouter);
    app.use('/classe', classeRouter);
    app.use('/document', documentRouter);
    app.use('/forum', forumRouter);
    app.use('/club', clubRouter);

    //start app
    server = app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });

};


//close express app
export async function closeApp() {
    await sequelize.authenticate();
    await sequelize.close();
    server.close();
};
