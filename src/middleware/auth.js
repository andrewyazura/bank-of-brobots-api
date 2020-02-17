import exjwt from 'express-jwt';
import { exJwtConf } from '../config';

export default exjwt(exJwtConf);
