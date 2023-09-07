<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">登录 后台管理中心</div>
    <div class="login-form-sub-title"
      >持续以最新流行技术栈构建的中后台管理框架</div
    >
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
          :max-length="50"
        >
          <template #prefix><icon-user /></template>
        </a-input>
      </a-form-item>
      <a-form-item field="password" hide-label>
        <a-input-password
          v-model="form.password"
          placeholder="请输入密码"
          :max-length="32"
          allow-clear
        >
          <template #prefix><icon-lock /></template>
        </a-input-password>
      </a-form-item>
      <a-form-item class="login-form-captcha" field="captcha" hide-label>
        <a-input
          v-model="form.captcha"
          placeholder="请输入验证码"
          allow-clear
          style="width: 63%"
        >
          <template #prefix><icon-check-circle /></template>
        </a-input>
        <img :src="captchaImgBase64" alt="验证码" @click="getCaptcha" />
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-remember-me">
          <a-checkbox v-model="remember" checked="rememberMe">
            记住我
          </a-checkbox>
        </div>
        <a-button :loading="loading" type="primary" long html-type="submit">
          登录
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, ref, toRefs, reactive, computed } from 'vue';
  import { FieldRule, ValidatedError } from '@arco-design/web-vue';
  import { LoginReq } from '@/api/auth/login';
  import { useRouter } from 'vue-router';
  import { useStorage } from '@vueuse/core';
  import { useLoginStore } from '@/store';
  // import { encryptByRsa } from '@/utils/encrypt';

  const { proxy } = getCurrentInstance() as any;

  const captchaImgBase64 = ref('');
  const loginStore = useLoginStore();
  const loading = ref(false);
  const router = useRouter();
  const loginConfig = useStorage('login-config', {
    rememberMe: true,
    username: 'admin', // 演示默认值
    // password: '123456', // 演示默认值
    // username: debug ? 'admin' : '', // 演示默认值
    // password: debug ? 'admin123' : '', // 演示默认值
  });

  // watch(() => loginConfig.value.rememberMe, (value) => {
  //   loginConfig.value.rememberMe = value;
  // })

  const data = reactive({
    // 表单数据
    form: {
      username: loginConfig.value.username,
      password: '',
      captcha: '',
      key: '',
    } as LoginReq,
    remember: loginConfig.value.rememberMe,
    // 表单验证规则
    rules: computed((): Record<string, FieldRule[]> => {
      return {
        username: [{ required: true, message: '请输入用户名' }],
        password: [{ required: true, message: '请输入密码' }],
        captcha: [{ required: true, message: '请输入验证码' }],
      };
    }),
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
          key: values.uuid,
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
    margin-top: 32px;
    &-wrapper {
      width: 320px;
    }
    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }
    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }
    &-captcha img {
      width: 111px;
      height: 36px;
      margin: 0 0 0 10px;
      cursor: pointer;
    }
    &-remember-me {
      display: flex;
      justify-content: space-between;
    }
    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }
</style>
