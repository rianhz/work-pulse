import app from './app';
import { connectDatabase } from './config/database';
import { Env } from './config/env-config';

const PORT = Env.PORT;

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`📡 Server running on ${PORT}`);
  });
};

startServer();