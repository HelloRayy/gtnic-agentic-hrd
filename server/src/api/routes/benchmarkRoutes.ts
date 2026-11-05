import { Router } from 'express';
import { handleDeliberateCompare } from '../controllers/benchmarkController.js';

export const benchmarkRouter = Router();

benchmarkRouter.post('/benchmark/deliberate', handleDeliberateCompare);
benchmarkRouter.post('/deliberate-compare', handleDeliberateCompare);
