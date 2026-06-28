import express from 'express';
import cors from 'cors';
import { authRoutes } from './modules/authentication/routes';
import { usersRoutes } from './modules/users/routes';
import { corsOptions } from './config/cors';
import helmet from 'helmet';
import cookieParser from "cookie-parser";
import { errorHandler } from './middleware/error-handler';
import { projectsRoutes } from './modules/projects/routes';
import { timesheetRoutes } from './modules/timesheet/routes';
import { tenantsRoutes } from './modules/tenants/routes';
import { invitationRoutes } from './modules/invitation/routes';
import { departmentRoutes } from './modules/departments/routes';
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet())
app.use(cookieParser());
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/tenants', tenantsRoutes);
app.use('/projects', projectsRoutes);
app.use('/timesheets', timesheetRoutes);
app.use('/invitations', invitationRoutes);
app.use('/departments', departmentRoutes);

app.use(errorHandler);

export default app;