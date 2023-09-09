import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';

import localeUser from '@/views/system/user/locale/zh-CN';
import localeRole from '@/views/system/role/locale/zh-CN';

import localeOnlineUser from '@/views/monitor/online/locale/zh-CN';
import localeLoginLog from '@/views/monitor/log/login/locale/zh-CN';
import localeOperationLog from '@/views/monitor/log/operation/locale/zh-CN';
import localeSystemLog from '@/views/monitor/log/system/locale/zh-CN';

import localeMessageBox from '@/components/message-box/locale/zh-CN';
// import localeLogin from '@/views/login/locale/zh-CN';
import localeUserCenter from '@/views/system/user/center/locale/zh-CN';
import localeSettings from './zh-CN/settings';

export default {
  'title': 'Cool Admin',
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.system': '系统管理',
  'menu.tool': '系统工具',
  'menu.monitor': '系统监控',
  'menu.list': '列表页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.visualization': '数据可视化',
  'menu.server.monitor': '实时监控-服务端',
  'menu.arcoWebsite': 'Arco Design Vue',
  'menu.user': '个人中心',

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
