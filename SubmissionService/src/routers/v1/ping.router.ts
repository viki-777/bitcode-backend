import express from 'express';
import { pingHandler } from '../../controllers/ping.controller';

const pingRouter = express.Router();

pingRouter.get('/', pingHandler);

pingRouter.get('/helth', (req, res) => {
    res.status(200).json('OK');
});

export default pingRouter;