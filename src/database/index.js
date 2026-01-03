import mongoose from 'mongoose';
import config from '../config/index.js';
import logger from '../core/logger.js';
export const connectDB = async () => {
    try {
        await mongoose.connect(config.database.uri);
        logger.info('MongoDB Connected');
    }
    catch (err) {
        logger.error('DB Error:', err);
        process.exit(1);
    }
};
//# sourceMappingURL=index.js.map