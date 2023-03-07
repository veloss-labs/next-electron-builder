import {Router} from 'express';

const router = Router();

router.get('/api/_health', (_, res) => res.json({message: 'OK!'}));

router.get('/api/hello', (req, res) => {
  res.json({message: 'Hello from server!'});
});

export default router;
