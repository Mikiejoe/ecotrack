import App from './core/server.js';
import config from './config/index.js';
import logger from './core/logger.js';
import { connectDB } from './database/index.js';
const app = new App();
app.listen(config.port, () => {
    logger.info(`Server available at http://localhost:${config.port}`);
    connectDB();
});
//# sourceMappingURL=index.js.map