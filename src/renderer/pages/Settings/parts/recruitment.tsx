import * as React from 'react';
import type { Type as RecruitmentType } from 'main/storage/configuration/recruitment';
import _ from 'lodash';
import { Divider, Space, Checkbox, Typography, InputNumber } from 'antd';

type RecruitmentProps = {
  conf: RecruitmentType;
  onChange: (conf: RecruitmentType) => void;
};

class Recruitment extends React.PureComponent<RecruitmentProps> {
  render() {
    const { conf, onChange } = this.props;
    const config = _.cloneDeep(conf);
    return (
      <div id="recruitment" className="setting-catetory">
        <Divider>自动公招</Divider>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <Space direction="vertical">
            <Checkbox
              checked={config.NormalTagRefreshing}
              onChange={(e) => {
                config.NormalTagRefreshing = e.target.checked;
                onChange(config);
              }}
            >
              自动刷新3星Tags
            </Checkbox>
            <Space>
              <Typography.Text>
                每次执行时
                <br />
                最大招募次数
              </Typography.Text>
              <InputNumber
                value={config.MaximumNumberOfRecruitments}
                onChange={(value) => {
                  config.MaximumNumberOfRecruitments = value;
                  onChange(config);
                }}
              />
            </Space>
          </Space>
          <Space direction="vertical">
            <Checkbox
              checked={config.recognitions['3 Stars']}
              onChange={(e) => {
                config.recognitions['3 Stars'] = e.target.checked;
                onChange(config);
              }}
            >
              自动确认3星
            </Checkbox>
            <Checkbox
              checked={config.recognitions['4 Stars']}
              onChange={(e) => {
                config.recognitions['4 Stars'] = e.target.checked;
                onChange(config);
              }}
            >
              自动确认4星
            </Checkbox>
            <Checkbox
              checked={config.recognitions['4 Stars']}
              onChange={(e) => {
                config.recognitions['4 Stars'] = e.target.checked;
                onChange(config);
              }}
            >
              自动确认5星
            </Checkbox>
          </Space>
        </div>
      </div>
    );
  }
}

export default Recruitment;
