import express, { Request, Response } from "express";
import { forumController } from "../controller/forum.controller";

//create router
export const forumRouter = express.Router();


forumRouter.get('/', forumController.getAll);

forumRouter.post('/add', forumController.add);

forumRouter.post('/edit/:forumId', forumController.edit);

forumRouter.post('/delete/:forumId', forumController.delete);

forumRouter.get('/:forumId', forumController.get);


forumRouter.get('/acces/:forumId', forumController.accesGet);

forumRouter.post('/acces/add/:forumId', forumController.accesAdd);

forumRouter.post('/acces/delete/:forumId', forumController.accesDelete);


forumRouter.get('/post/:forumId', forumController.posteGet);

forumRouter.post('/post/add/:forumId', forumController.posteAdd);

forumRouter.get('/post/edit/:forumId', forumController.posteEdit);

forumRouter.get('/post/delete/:forumId', forumController.posteDelete);

forumRouter.get('/post/add-document/:forumId', forumController.posteAddDocument);
