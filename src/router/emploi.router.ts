import express, { Request, Response } from "express";
import { emploiController } from "../controller/emploi.controller";

//create router
export const emploiRouter = express.Router();


emploiRouter.get('/:classeId', emploiController.get);

emploiRouter.post('/add/:classeId', emploiController.add);

emploiRouter.post('/edit/:classeId', emploiController.edit);

emploiRouter.post('/delete/:classeId', emploiController.delete);


emploiRouter.get('/timeline/:emploiId', emploiController.timelinesGet);

emploiRouter.post('/timeline/add/:emploiId', emploiController.timelineAdd);

emploiRouter.post('/timeline/delete/:emploiId', emploiController.timelineRemove);

emploiRouter.post('/timeline/edit/:emploiId', emploiController.timelineEdit);