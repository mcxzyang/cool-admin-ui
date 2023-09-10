<template>
  <a-form
    ref="formRef"
    :model="form"
    :rules="rules"
    :label-col-props="{ span: 8 }"
    :wrapper-col-props="{ span: 16 }"
    size="large"
    class="form"
  >
    <a-form-item label="用户名" disabled>
      <a-input
        v-model="form.username"
        placeholder="请输入用户名"
        :max-length="16"
      />
    </a-form-item>

    <a-form-item>
      <a-space>
        <a-button :loading="loading" type="primary" @click="handleSave">
          保存
        </a-button>
        <a-button @click="handleReset"> 重置 </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, ref, toRefs, reactive, computed } from 'vue';
  import { FieldRule } from '@arco-design/web-vue';
  import { BasicInfoModel, updateBasicInfo } from '@/api/system/user-center';
  import { useI18n } from 'vue-i18n';
  import { useLoginStore } from '@/store';

  const { proxy } = getCurrentInstance() as any;

  const { t } = useI18n();
  const loginStore = useLoginStore();
  const loading = ref(false);

  const data = reactive({
    // 表单数据
    form: {
      username: loginStore.username,
    } as BasicInfoModel,
    // 表单验证规则
    rules: computed((): Record<string, FieldRule[]> => {
      return {
        username: [
          {
            required: true,
            message: '请输入用户名',
          },
          {
            match: /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/,
            message: '用户名格式错误',
          },
        ],
      };
    }),
  });
  const { form, rules } = toRefs(data);

  /**
   * 保存
   */
  const handleSave = () => {
    if (loading.value) return;
    proxy.$refs.formRef.validate((valid: any) => {
      if (!valid) {
        loading.value = true;
        updateBasicInfo({
          username: form.value.username,
        })
          .then(() => {
            loginStore.getInfo();
            proxy.$message.success(t('userCenter.basicInfo.form.save.success'));
          })
          .finally(() => {
            loading.value = false;
          });
      }
    });
  };

  /**
   * 重置
   */
  const handleReset = () => {
    proxy.$refs.formRef.resetFields();
  };
</script>

<style scoped lang="less">
  .form {
    width: 540px;
    margin: 0 auto;
  }
</style>
