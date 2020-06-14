/**
 *this is responsible for consumming the controllers and converting them into express friendly router callbacks funtions
 * @param {Funtion} controller this is the controller function that consummes the service funtions
 * @returns {Funtion} the express router calback function
 */
export default function makeExpressCallabck(controller) {
  return (req, res) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      method: req.method,
      path: req.path,
      authObject: req.authObject,
      headers: {
        'Content-Type': req.get('Content-Type'),
      },
    };
    controller(httpRequest)
      .then((httpResponse) => {
        if (httpResponse.headers) {
          res.set(httpResponse.headers);
        }
        res.type('json');
        res.status(httpResponse.statusCode).send(httpResponse.body);
      })
      .catch((e) =>
        res.status(500).send({ error: 'An unkown error occurred.' }),
      );
  };
}
