import * as types from './types';
import * as service from './service';

const BackendFaker = {
  types,
  service
}

export default BackendFaker;

Object.assign(module.exports, BackendFaker);