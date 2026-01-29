import ioredis from 'ioredis'
import config from '../config/index.js';

export const redis = new ioredis(config.redis);
