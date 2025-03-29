import {Router} from 'express';
import {eventsData} from '../data/index.js';

const router = Router();

router
  .route('/')
  .get(async (req, res) => {

    try {
    //   TODO
      return res.json({data: "data"});
    } catch (e) {
      return res.status(500).json({error: e});
    }

  });

export default router;
