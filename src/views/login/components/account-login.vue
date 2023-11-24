<template>
  <a-form
    ref="formRef"
    :model="form"
    :rules="rules"
    layout="vertical"
    size="large"
    class="login-form"
    @submit="handleLogin"
  >
    <a-form-item field="username" hide-label>
      <a-input
        v-model="form.username"
        placeholder="请输入用户名"
        :max-length="64"
        allow-clear
      />
    </a-form-item>
    <a-form-item field="password" hide-label>
      <a-input-password
        v-model="form.password"
        placeholder="请输入密码"
        :max-length="32"
      />
    </a-form-item>
    <a-form-item field="captcha" hide-label>
      <a-input
        v-model="form.captcha"
        placeholder="请输入验证码"
        :max-length="4"
        allow-clear
        style="flex: 1 1"
      />
      <img
        :src="captchaImgBase64"
        alt="验证码"
        class="captcha"
        @click="getCaptcha"
      />
    </a-form-item>
    <div class="remember-me">
      <a-checkbox v-model="remember" checked="rememberMe"> 记住我 </a-checkbox>
    </div>
    <a-button class="btn" :loading="loading" type="primary" html-type="submit">
      立即登录
    </a-button>
  </a-form>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, ref, toRefs, reactive } from 'vue';
  import { useStorage } from '@vueuse/core';
  import { useLoginStore } from '@/store';
  import { ValidatedError } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';
  import { LoginReq } from '@/api/auth/login';

  const { proxy } = getCurrentInstance() as any;
  const router = useRouter();
  const loginStore = useLoginStore();
  const loading = ref(false);
  const captchaImgBase64 = ref();
  const loginConfig = useStorage('login-config', {
    rememberMe: true,
    username: '', // 演示默认值
    password: '', // 演示默认值
  });
  const data = reactive({
    form: {
      username: loginConfig.value.username,
      password: loginConfig.value.password,
      captcha: '',
      key: '',
    } as LoginReq,
    remember: loginConfig.value.rememberMe,
    rules: {
      username: [{ required: true, message: '请输入用户名' }],
      password: [{ required: true, message: '请输入密码' }],
      captcha: [{ required: true, message: '请输入验证码' }],
    },
  });
  const { form, rules, remember } = toRefs(data);

  /**
   * 获取验证码
   */
  const getCaptcha = () => {
    loginStore.getImgCaptcha().then((res) => {
      form.value.key = res.data.key;
      captchaImgBase64.value = res.data.img;
    });
  };
  getCaptcha();

  /**
   * 登录
   *
   * @param errors 表单验证错误
   * @param values 表单数据
   */
  const handleLogin = ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) return;
    if (!errors) {
      loading.value = true;
      loginStore
        .login({
          username: values.username,
          // password: encryptByRsa(values.password) || '',
          password: values.password,
          captcha: values.captcha,
          key: values.key,
        })
        .then(() => {
          const { redirect, ...othersQuery } = router.currentRoute.value.query;
          router.push({
            name: (redirect as string) || 'Workplace',
            query: {
              ...othersQuery,
            },
          });
          // const { rememberMe } = loginConfig.value;
          const { username } = values;
          loginConfig.value.username = remember.value ? username : '';
          proxy.$message.success('登录成功');
        })
        .catch(() => {
          getCaptcha();
          form.value.captcha = '';
        })
        .finally(() => {
          loading.value = false;
        });
    }
  };

  /**
   * 记住我
   *
   * @param value 是否记住我
   */
  // const setRememberMe = (value: boolean) => {
  //   loginConfig.value.rememberMe = value;
  // };
</script>

<style lang="less" scoped>
  .login-form {
    box-sizing: border-box;
    padding: 0 5px;
    margin-top: 16px;
    .arco-input-wrapper,
    :deep(.arco-select-view-single) {
      background-color: var(--color-bg-white);
      border: 1px solid var(--color-border-3);
      height: 40px;
      border-radius: 4px;
      font-size: 13px;
    }
    .arco-input-wrapper.arco-input-error {
      background-color: var(--color-danger-light-1);
      border-color: var(--color-danger-light-4);
    }

    .captcha {
      width: 111px;
      height: 36px;
      margin: 0 0 0 5px;
      cursor: pointer;
    }

    .remember-me {
      display: flex;
      justify-content: space-between;
      .arco-checkbox {
        padding-left: 0;
      }
    }

    .btn {
      border-radius: 4px;
      box-shadow: 0 0 0 1px #05f, 0 2px 1px rgba(0, 0, 0, 0.15);
      font-size: 14px;
      font-weight: 500;
      height: 40px;
      line-height: 22px;
      margin: 20px 0 12px;
      width: 100%;
    }
  }
</style>
