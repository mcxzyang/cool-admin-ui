import localeWorkplace from '@/views/dashboard/workplace/locale/en-US';

import localeUser from '@/views/system/user/locale/en-US';
import localeRole from '@/views/system/role/locale/en-US';

import localeOnlineUser from '@/views/monitor/online/locale/en-US';
import localeLoginLog from '@/views/monitor/log/login/locale/en-US';
import localeOperationLog from '@/views/monitor/log/operation/locale/en-US';
import localeSystemLog from '@/views/monitor/log/system/locale/en-US';

import localeMessageBox from '@/components/message-box/locale/en-US';
import localeUserCenter from '@/views/system/user/center/locale/en-US';
import localeSettings from './en-US/settings';

export default {
  'title': 'ContiNew Admin',
  'menu.dashboard': 'Dashboard',
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.system': 'System management',
  'menu.tool': 'Tool',
  'menu.monitor': 'Monitor',
  'menu.list': 'List',
  'menu.form': 'Form',
  'menu.profile': 'Profile',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.visualization': 'Data Visualization',
  'menu.server.monitor': 'Monitor-Server',
  'menu.arcoWebsite': 'Arco Design Vue',
  'menu.github': 'GitHub',
  'menu.user': 'User Center',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',

  ...localeWorkplace,

  ...localeUser,
  ...localeRole,

  ...localeOnlineUser,
  ...localeLoginLog,
  ...localeOperationLog,
  ...localeSystemLog,

  ...localeMessageBox,
  // ...localeLogin,
  ...localeUserCenter,
  ...localeSettings,
};
