import { useRoutes } from 'react-router-dom';
import routes from 'renderer/routes';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { message, Modal, Typography } from 'antd';

import NavBar from './layouts/NavBar';

import './App.less';

window.$ipcRenderer.on('storage:error', (msg) => {
  message.error(String(msg));
});

let noticed = false;

export default function App() {
  const route = useRoutes(routes);
  const status = window.$ipcRenderer.sendSync('storage:error');
  if (status && !noticed) {
    noticed = true;
    Modal.warning({
      title: <Typography.Text strong>警告</Typography.Text>,
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>配置文件出错，{status}。</p>
          {status === '已重置' ? (
            <p>出现错误的文件已被保存到config.json.backup。</p>
          ) : (
            <p />
          )}
        </div>
      ),
      okText: '知道了',
    });
  }

  return (
    <div className="app">
      <NavBar />
      {route}
    </div>
  );
}
