import express from 'express';
import cors from 'cors';
import { authRoutes } from './modules/authentication/routes';
import { usersRoutes } from './modules/users/routes';
import { corsOptions } from './config/cors';
import { protectRoute } from './middleware/auth-middleware';
import helmet from 'helmet';
import cookieParser from "cookie-parser";
import { errorHandler } from './middleware/error-handler';
import { projectsRoutes } from './modules/projects/routes';
import { timesheetRoutes } from './modules/timesheet/routes';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet())
app.use(cookieParser());
app.use('/auth', authRoutes);
app.use('/users',protectRoute, usersRoutes);
app.use('/projects', protectRoute, projectsRoutes);
app.use('/timesheets', protectRoute, timesheetRoutes);

app.use(errorHandler);

export default app;