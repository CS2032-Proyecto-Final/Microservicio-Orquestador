

import http from 'http';
import express from 'express';
import cors from 'cors';
import { postMovimiento, postPagoPromocion } from './controller/OrquestadorController';

const app = express();

app.use(cors({
    credentials:true
}))

app.use(express.json()); // Add this to parse JSON bodies

const server = http.createServer(app);

server.listen(8001, () => {
    console.log('Server running on http://localhost:8001/')
})
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).json({ Status: 'UP' });
});
app.post('/movimiento/transferencia/:remitente_id', postMovimiento);
app.post('/movimiento/pago/promocion/:promocion_id', postPagoPromocion);