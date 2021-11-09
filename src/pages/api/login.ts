import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { sessionMiddleware } from 'lib/session';
import { PlexApi } from 'lib/plex';

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(sessionMiddleware()).get(async (req, res) => {
  let { pin } = req.session;

  const plexApi = new PlexApi();

  if (pin) {
    if (!pin.authToken) {
      try {
        pin = await plexApi.getPin(pin.id, pin.code);
      } catch (error) {
        // console.error(error.response.data);
      }

      if (pin.authToken) {
        req.session.pin = pin;
        await req.session.save();
      } else {
        req.session.destroy();
      }
    }

    res.redirect('/');
  } else {
    pin = await plexApi.createPin();

    req.session.pin = pin;
    await req.session.save();

    res.redirect(plexApi.authUrl(pin, 'http://localhost:3000/api/login'));
  }
});

export default handler;
