import path from 'path';
import { fileURLToPath } from 'url';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { config } from './src/config/environment.js';
import { sequelize } from './src/config/database.js';
import routes from './src/routes/index.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { revalidateAfterMutation } from './src/middleware/revalidate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(revalidateAfterMutation);
app.use('/api', routes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app };
export default app;
