import * as React from 'react';
import type { Type as MallType } from 'common/storage/configuration/mall';
import _ from 'lodash';
import { Divider, Checkbox, Typography } from 'antd';

type MallProps = {
  conf: MallType;
  onChange: (conf: MallType) => void;
};

class Mall extends React.PureComponent<MallProps> {
  render() {
    const { conf, onChange } = this.props;
    const config = _.cloneDeep(conf);
    return (
      <div id="mall" className="setting-catetory">
        <Divider>信用商店</Divider>
        <Checkbox
          checked={config.enable}
          onChange={(e) => {
            config.enable = e.target.checked;
            onChange(config);
          }}
        >
          <Typography.Text>
            信用商店随缘买
            <br />
            （不买碳和家具）
          </Typography.Text>
        </Checkbox>
      </div>
    );
  }
}

export default Mall;
