<template>
  <a-list-item-meta>
    <template #avatar>
      <a-typography-paragraph> 更新密码 </a-typography-paragraph>
    </template>
    <template #description>
      <div class="content">
        <a-typography-paragraph> 已设置 </a-typography-paragraph>
      </div>
      <div class="operation">
        <a-link title="修改" @click="toUpdate"> 修改 </a-link>
      </div>
    </template>
  </a-list-item-meta>

  <a-modal
    title="修改密码"
    :visible="visible"
    :mask-closable="false"
    :esc-to-close="false"
    @ok="handleUpdate"
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :model="form" :rules="rules" size="large">
      <a-form-item
        label="旧密码
        "
        field="password"
      >
        <a-input-password
          v-model="form.password"
          placeholder="请输入旧密码
          "
          :max-length="32"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        label="新密码
        "
        field="new_password"
      >
        <a-input-password
          v-model="form.new_password"
          placeholder="长度为 6 到 32 位，同时包含数字和字母
          "
          :max-length="32"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        label="确认新密码
        "
        field="new_password_confirmation"
      >
        <a-input-password
          v-model="form.new_password_confirmation"
          placeholder="请输入确认新密码
          "
          :max-length="32"
          allow-clear
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, ref, reactive, computed } from 'vue';
  import { FieldRule } from '@arco-design/web-vue';
  import { updatePassword } from '@/api/system/user-center';
  // import { useI18n } from 'vue-i18n';
  // import { useLoginStore } from '@/store';
  // import { encryptByRsa } from '@/utils/encrypt';

  const { proxy } = getCurrentInstance() as any;

  // const { t } = useI18n();
  // const loginStore = useLoginStore();
  const visible = ref(false);

  // 表单数据
  const form = reactive({
    password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  // 表单验证规则
  const rules = computed((): Record<string, FieldRule[]> => {
    return {
      password: [
        {
          required: true,
          message: '请输入旧密码',
        },
      ],
      new_password: [
        {
          required: true,
          message: '请输入新密码',
        },
        {
          match: /^(?=.*\d)(?=.*[a-z]).{6,32}$/,
          message: '新密码格式错误，长度为 6 - 32 之间',
        },
        {
          validator: (value, callback) => {
            if (value === form.password) {
              callback('新密码不能和旧密码相同');
            } else {
              callback();
            }
          },
        },
      ],
      new_password_confirmation: [
        {
          required: true,
          message: '请输入确认新密码',
        },
        {
          validator: (value, callback) => {
            if (value !== form.new_password) {
              callback('两次输入密码不一致');
            } else {
              callback();
            }
          },
        },
      ],
    };
  });

  /**
   * 取消
   */
  const handleCancel = () => {
    visible.value = false;
    proxy.$refs.formRef.resetFields();
  };

  /**
   * 修改
   */
  const handleUpdate = () => {
    proxy.$refs.formRef.validate((valid: any) => {
      if (!valid) {
        updatePassword({
          password: form.password || '',
          new_password: form.new_password || '',
          new_password_confirmation: form.new_password_confirmation || '',
        }).then((res) => {
          handleCancel();
          proxy.$message.success(res.message);
        });
      }
    });
  };

  /**
   * 打开修改对话框
   */
  const toUpdate = () => {
    visible.value = true;
  };
</script>

<style scoped lang="less"></style>
