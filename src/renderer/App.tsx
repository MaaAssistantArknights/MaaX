import { useRoutes } from 'react-router-dom';
import routes from 'renderer/routes';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { message, Modal, Typography } from 'antd';

import NavBar from './layouts/NavBar';

import './App.less';

window.$ipcRenderer.on('electron-store-set-error', (msg) => {
  message.error(String(msg));
});

let noticed = false;

export default function App() {
  const route = useRoutes(routes);
  const isStorageReset = window.$ipcRenderer.sendSync('electron-store-reset');
  if (isStorageReset && !noticed) {
    noticed = true;
    Modal.warning({
      title: <Typography.Text strong>警告</Typography.Text>,
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>你的配置文件已经被重置，请不要自己修改config.json。</p>
          <p>出现错误的文件已被保存到config.json.backup。</p>
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
