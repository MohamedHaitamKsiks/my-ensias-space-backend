import express, { Request, Response } from "express";
import { forumController } from "../controller/forum.controller";
import { userController } from "../controller/user.controller";
import { userMiddleware } from "../middleware/user.middleware";
import { etudiantMiddleware } from "../middleware/etudiant.middleware";

//create router
export const forumRouter = express.Router();
forumRouter.use(userMiddleware.verifyUserLogged);
forumRouter.use(etudiantMiddleware.verifyEtudiant);

forumRouter.get('/', forumController.getAll);

forumRouter.post('/add', forumController.add);

forumRouter.post('/edit/:forumId', forumController.edit);

forumRouter.post('/close/:forumId', forumController.close);

forumRouter.post('/delete/:forumId', forumController.delete);

forumRouter.get('/:forumId', forumController.get);


forumRouter.get('/acces/:forumId', forumController.accesGet);

forumRouter.post('/acces/add/:forumId', forumController.accesAdd);

forumRouter.post('/acces/delete/:forumId', forumController.accesDelete);


forumRouter.get('/post/:forumId', forumController.posteGet);

forumRouter.post('/post/add/:forumId', forumController.posteAdd);

forumRouter.post('/post/edit/:forumId', forumController.posteEdit);

forumRouter.post('/post/delete/:forumId', forumController.posteDelete);

forumRouter.post('/post/document/add/:forumId', forumController.posteAddDocument);

forumRouter.post('/post/document/delete/:forumId', forumController.posteAddDocument);
