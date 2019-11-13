import { Router } from 'express';

import StudentController from './app/controller/StudentController';
import SessionController from './app/controller/SessionController';
import authMiddleware from './app/middlewares/auth';
import PlanController from './app/controller/PlanController';
import MatriculationController from './app/controller/MatriculationController';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.use(authMiddleware);
routes.post('/students', StudentController.store);

routes.get('/plans', PlanController.index);
routes.get('/plans/:id', PlanController.show);
routes.put('/plans/:id', PlanController.update);
routes.post('/plans', PlanController.store);
routes.delete('/plans/:id', PlanController.delete);

routes.post('/matriculation', MatriculationController.store);
routes.get('/matriculation', MatriculationController.index);
routes.put('/matriculation/:id', MatriculationController.update);

export default routes;
