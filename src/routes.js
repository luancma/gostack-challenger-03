import { Router } from 'express';

import StudentController from './app/controller/StudentController';
import SessionController from './app/controller/SessionController';
import authMiddleware from './app/middlewares/auth';
import PlanController from './app/controller/PlanController';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.use(authMiddleware);
routes.post('/students', StudentController.store);
routes.get('/plans', PlanController.index);
routes.get('/plans/:id', PlanController.show);
routes.post('/plans', PlanController.store);

export default routes;
