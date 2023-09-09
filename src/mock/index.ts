import Mock from 'mockjs';

import './login';
import './message-box';

import '@/views/dashboard/workplace/mock';

import '@/views/system/user/center/mock';

Mock.setup({
  timeout: '15-150',
});
