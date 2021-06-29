import { getDetails, createDetails } from '../controllers/form.js';
import form from '../models/form.js';
const router = express.Router();


router.post('/', createDetails );



export default router;