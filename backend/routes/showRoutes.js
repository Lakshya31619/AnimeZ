import express from 'express';
import { 
  addShow, 
  getNowPlayingMovies,
  searchMovies
} from '../controllers/showController.js';
import { protectAdmin } from '../middleware/auth.js';

const showRouter = express.Router();

showRouter.get('/now-playing', protectAdmin, getNowPlayingMovies);
showRouter.post('/add', protectAdmin, addShow);

showRouter.get('/search', searchMovies);

export default showRouter;