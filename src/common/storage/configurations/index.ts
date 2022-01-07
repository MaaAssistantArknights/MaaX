import connection from './connection';
import infrastructure from './infrastructure';
import mall from './mall';
import recruitment from './recruitment';
import report from './report';
import update from './update';

export default {
  infrastructure: {
    type: 'object',
    properties: {
      ...connection,
      ...infrastructure,
      ...mall,
      ...recruitment,
      ...report,
      ...update,
    },
  },
};
