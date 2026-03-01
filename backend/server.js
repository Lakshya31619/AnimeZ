import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import { functions, inngest } from './inngest/index.js';
import showRouter from './routes/showRoutes.js';
import userRouter from './routes/userRoutes.js';
import muxRouter from "./routes/muxRoutes.js"; 

const app = express();
const PORT = 3000;

await connectDB();

app.use(express.json());
app.use(cors({
  origin: process.env.VITE_BASE_URL,
  credentials: true,
}));
app.use(clerkMiddleware());

app.get('/', (req, res)=> res.send('Server is Live'));
app.use('/api/inngest', serve({client: inngest, functions}));
app.use('/api/show', showRouter);
app.use('/api/user', userRouter);
app.use("/api/mux", muxRouter);

app.listen(PORT, ()=> console.log(`Server started at http://localhost:${PORT}`));