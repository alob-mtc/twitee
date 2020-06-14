// Routers
import twitRouter from './twit-router';
import userRouter from './userRouter';
// not-found
import notFound from '../controllers/not-found';
import makeCallBack from '../express-callback';
// api root
const apiRoot = process.env.API_ROOT_V1;

export default function (app) {
  // user router
  makeRouter('user', userRouter);
  // twit router
  makeRouter('twit', twitRouter);
  // the root endpoint
  app.get(`${apiRoot}`, (req, res) => {
    res.status(200).json({
      status: 'success',
      data: {
        message: 'This is Application Root endpoint',
        info: 'this is the api root v1',
      },
    });
  });
  // the not-found end point
  app.use(makeCallBack(notFound));
  // the make router function
  function makeRouter(path, router) {
    // the router configuration
    app.use(`${apiRoot}/${path}`, router);
  }
}
