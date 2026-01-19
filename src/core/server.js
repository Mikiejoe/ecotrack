import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from '../config/index.js';
import logger from './logger.js';
import v1Routes from '../api/v1/routes/index.js';
import { errorHandler } from '../api/v1/middlewares/error.middleware.js';

class App {
    app;
    constructor() {
        this.app = express();
        this.setupMiddleware();
        this.setupRoutes();
    }
    setupMiddleware() {
        const stream = { write: (message) => logger.http(message.trim()) };
        this.app.use(morgan('combined', { stream }));
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(express.json());
        
    }
    setupRoutes() {
        this.app.get('/', (req, res) => {
            res.status(200).send('API is running');
        });
        this.app.use(`/api/${config.apiVersion}`, v1Routes);
        this.app.use(errorHandler)
    }
    listen(port, callback) {
        this.app.listen(port, callback);
    }
}
export default App;
//# sourceMappingURL=server.js.map