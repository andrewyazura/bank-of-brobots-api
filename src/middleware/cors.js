import { expConf } from '../config';

export default (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', expConf['allowOriginHeader']);
  res.setHeader('Access-Control-Allow-Headers', expConf['allowHeadersHeader']);
  next();
};
