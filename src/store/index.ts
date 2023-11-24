import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useDictStore from './modules/dict';
import useTabBarStore from './modules/tab-bar';
import useLoginStore from './modules/login';

const pinia = createPinia();

export { useAppStore, useDictStore, useTabBarStore, useLoginStore };
export default pinia;
