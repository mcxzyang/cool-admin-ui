<template>
  <a-modal
    v-model:visible="modalVisible"
    width="60%"
    @cancel="handleCancel"
    @before-ok="handleBeforeOk"
  >
    <template #title> {{ modalData.id ? '编辑' : '创建' }} </template>
    <div>
      <a-form ref="formRef" :model="modalData" :rules="rules">
        <a-row>
          <a-col :span="24">
            <a-form-item label="姓名" field="name">
              <a-input v-model="modalData.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="登录用户名" field="username">
              <a-input v-model="modalData.username"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="登录密码" field="password">
              <a-input v-model="modalData.password" type="password"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="所属角色" field="roles">
              <a-select v-model="modalData.roles" multiple>
                <a-option
                  v-for="(item, key) in roles"
                  :key="key"
                  :value="item.id"
                  >{{ item.name }}</a-option
                >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref, watch, reactive, toRefs, getCurrentInstance } from 'vue';

  import { Message } from '@arco-design/web-vue';
  import { cloneDeep } from 'lodash';
  import { addRecord, updateRecord, DataRecord } from '@/api/system/adminUser';
  import { list as getRoles } from '@/api/system/role';

  const { proxy } = getCurrentInstance() as any;

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => null,
    },
  });

  const modalVisible = ref(false);
  const emit = defineEmits(['update-visible', 'update-success']);
  const roles = ref([]) as any;

  const generateForm = () => {
    return {
      id: undefined,
      name: undefined,
      username: '',
      password: undefined,
      roles: [],
    };
  };

  const modalData = ref<DataRecord>(generateForm());

  const data = reactive({
    rules: {
      name: [
        { required: true, message: '请输入姓名' },
        {
          match: /^[\u4e00-\u9fa5a-zA-Z0-9_-]{1,20}$/,
          message:
            '长度为 1 到 20 位，可以包含中文、字母、数字、下划线，短横线',
        },
      ],
      username: [{ required: true, message: '请输入用户名' }],
    },
  });
  const { rules } = toRefs(data);

  watch(
    () => props.visible,
    (value) => {
      modalVisible.value = value;
      proxy.$refs.formRef?.clearValidate();
    }
  );

  watch(
    () => props.formData,
    (value) => {
      if (value) {
        modalData.value = cloneDeep(value) as DataRecord;
      }
    },
    { immediate: true }
  );

  const handleCancel = () => {
    emit('update-visible', false);
  };

  const formRef = ref(null);
  const handleBeforeOk = (done: (closed: boolean) => void) => {
    const validateRef: any = formRef.value;
    if (validateRef) {
      validateRef.validate().then(async (res: any) => {
        if (!res) {
          try {
            if (!modalData.value.id) {
              await addRecord(modalData.value);
            } else {
              await updateRecord(modalData.value.id, modalData.value);
            }
            done(true);
            modalData.value = generateForm();
            emit('update-success');
            Message.success('操作成功');
          } catch (e) {
            done(false);
          }
        }
        done(false);
      });
    }
  };

  const getRolelist = async () => {
    const { data: roleList } = await getRoles({ paging: 0 });
    roles.value = roleList;
  };

  getRolelist();
</script>

<style scoped></style>
