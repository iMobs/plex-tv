import type { IronSessionOptions } from 'iron-session';
import { ironSession } from 'iron-session/express';
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextApiHandler, PreviewData } from 'next';
import type { ParsedUrlQuery } from 'querystring';

declare module 'iron-session' {
  interface IronSessionData {
    // TODO
  }
}

const cookieName = process.env.SESSION_NAME ?? 'TODO';
const password =
  process.env.SESSION_PASSWORD ?? 'TODOTODOTODOTODOTODOTODOTODOTODO';

const sessionOptions: IronSessionOptions = {
  cookieName,
  password,
};

export function sessionMiddleware() {
  return ironSession(sessionOptions);
}

export function withSessionApiRoute<Data = any>(
  handler: NextApiHandler<Data>,
): NextApiHandler<Data> {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr<
  Props extends { [key: string]: any } = { [key: string]: any },
  Query extends ParsedUrlQuery = ParsedUrlQuery,
  Data extends PreviewData = PreviewData,
>(
  handler: GetServerSideProps<Props, Query, Data>,
): GetServerSideProps<Props, Query, Data> {
  return withIronSessionSsr(
    handler as GetServerSideProps<Props>, // Not sure why this is needed
    sessionOptions,
  );
}

export default sessionOptions;
