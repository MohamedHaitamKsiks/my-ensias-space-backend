import express, { Request, Response } from "express";
import { clubController } from "../controller/club.controller";

//create router
export const clubRouter = express.Router();

//test request
clubRouter.get('/',clubController.get);

clubRouter.post('/add', clubController.add);

clubRouter.get('/:clubId', clubController.getAll);

clubRouter.post('/edit/:clubId', clubController.edit);

clubRouter.post('/delete/:clubId', clubController.delete);


clubRouter.get('/member/:clubId', clubController.memberGet);

clubRouter.post('/member/add/:clubId', clubController.memberAdd);

clubRouter.post('/member/delete/:clubId', clubController.memberRemove);


clubRouter.get('/president/:clubId', clubController.presidentGet);

clubRouter.post('/president/:clubId', clubController.presidentSet);
