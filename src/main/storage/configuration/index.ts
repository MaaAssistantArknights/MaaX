import connection, { Type as ConnectionType } from './connection';
import infrastructure, { Type as InfrastructureType } from './infrastructure';
import mall, { Type as MallType } from './mall';
import recruitment, { Type as RecruitmentType } from './recruitment';
import report, { Type as ReportType } from './report';
import update, { Type as UpdateType } from './update';

export default {
  type: 'object',
  properties: {
    connection,
    infrastructure,
    mall,
    recruitment,
    report,
    update,
  },
  required: [
    'connection',
    'infrastructure',
    'mall',
    'recruitment',
    'report',
    'update',
  ],
  additionalProperties: false,
};

export type Type = {
  connection: ConnectionType;
  infrastructure: InfrastructureType;
  mall: MallType;
  recruitment: RecruitmentType;
  report: ReportType;
  update: UpdateType;
};
