import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { sessionMiddleware } from 'lib/session';

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(sessionMiddleware()).get(async (req, res) => {
  req.session.destroy();

  res.end();
});

export default handler;
