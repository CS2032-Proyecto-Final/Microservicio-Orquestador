

import http from 'http';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
    credentials:true
}))


const server = http.createServer(app);

server.listen(8001, () => {
    console.log('Server running on http://localhost:8001/')
})
