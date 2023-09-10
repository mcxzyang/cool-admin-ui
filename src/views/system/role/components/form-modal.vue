<template>
  <a-drawer
    :visible="visible"
    :width="580"
    :mask-closable="false"
    :esc-to-close="false"
    unmount-on-close
    render-to-body
    @before-ok="handleBeforeOk"
    @cancel="handleCancel"
  >
    <template #title> {{ form.id ? '编辑' : '创建' }} </template>
    <a-form ref="formRef" :model="form" :rules="rules" size="large">
      <a-alert type="warning" style="margin-bottom: 15px">
        变更角色编码、功能权限或数据权限后，关联的用户需要重新登录时才会生效！
      </a-alert>
      <fieldset>
        <legend>基础信息</legend>
        <a-form-item label="角色名称" field="name">
          <a-input v-model="form.name" placeholder="请输入角色名称" />
        </a-form-item>
        <a-form-item label="角色编码" field="code">
          <a-input v-model="form.code" placeholder="请输入角色编码" />
        </a-form-item>
        <a-form-item label="描述" field="description">
          <a-textarea
            v-model="form.description"
            :max-length="200"
            placeholder="请输入描述"
            :auto-size="{
              minRows: 3,
            }"
            show-word-limit
          />
        </a-form-item>
      </fieldset>
      <fieldset>
        <legend>功能权限</legend>
        <a-form-item label="功能权限">
          <a-space style="margin-top: 2px">
            <a-checkbox v-model="menuExpandAll" @change="handleExpandAll()"
              >展开/折叠</a-checkbox
            >
            <a-checkbox v-model="menuCheckAll" @change="handleCheckAll()"
              >全选/全不选</a-checkbox
            >
          </a-space>
          <template #extra>
            <a-spin v-if="menuLoading" />
            <a-tree
              v-if="!menuLoading"
              ref="menuRef"
              v-model:checked-keys="form.menu_ids"
              :data="menuOptions"
              :check-strictly="!menuCheckStrictly"
              :default-expand-all="menuExpandAll"
              checkable
            />
          </template>
        </a-form-item>
      </fieldset>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
  import { ref, watch, reactive, toRefs, getCurrentInstance } from 'vue';
  import { cloneDeep, isEmpty } from 'lodash';
  import { Message, TreeNodeData } from '@arco-design/web-vue';
  import { addRecord, updateRecord, DataRecord } from '@/api/system/role';
  import { listTree } from '@/api/system/menu';

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

  const menuExpandAll = ref(true);
  const menuCheckAll = ref(false);
  const menuCheckStrictly = ref(false);
  const menuLoading = ref(false);

  const menuOptions = ref<TreeNodeData[]>([]);

  const modalVisible = ref(false);
  const emit = defineEmits(['update-visible', 'update-success']);

  const generateForm = () => {
    return {
      id: undefined,
      name: '',
      code: undefined,
      description: '',
      status: 1,
      menus: [],
    };
  };

  const form = ref<DataRecord>(generateForm());

  const data = reactive({
    rules: {
      name: [{ required: true, message: '请输入角色名称' }],
    },
  });

  const { rules } = toRefs(data);

  /**
   * 查询菜单树
   */
  const getMenuTree = () => {
    if (menuOptions.value.length <= 0) {
      menuLoading.value = true;
    }
    listTree()
      .then((res) => {
        menuOptions.value = res.data;
      })
      .finally(() => {
        menuLoading.value = false;
      });
  };

  watch(
    () => props.visible,
    (value) => {
      modalVisible.value = value;
      if (value) {
        getMenuTree();
      }
      proxy.$refs.formRef?.clearValidate();
    }
  );

  watch(
    () => props.formData,
    (value) => {
      form.value = isEmpty(value)
        ? generateForm()
        : (cloneDeep(value) as DataRecord);
    },
    { immediate: true }
  );

  const handleCancel = () => {
    emit('update-visible', false);
  };

  /**
   * 获取所有选中的菜单
   */
  const getMenuAllCheckedKeys = () => {
    // 获取目前被选中的菜单
    const checkedNodes = proxy.$refs.menuRef.getCheckedNodes();
    const checkedKeys = checkedNodes.map((item: TreeNodeData) => item.key);

    // 获取半选中的菜单
    const halfCheckedNodes = proxy.$refs.menuRef.getHalfCheckedNodes();
    const halfCheckedKeys = halfCheckedNodes.map(
      (item: TreeNodeData) => item.key
    );
    // eslint-disable-next-line prefer-spread
    checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
    return checkedKeys;
  };

  const formRef = ref(null);
  const handleBeforeOk = (done: (closed: boolean) => void) => {
    const validateRef: any = formRef.value;
    if (validateRef) {
      validateRef.validate().then(async (res: any) => {
        if (!res) {
          form.value.menu_ids = getMenuAllCheckedKeys();
          try {
            if (!form.value.id) {
              await addRecord(form.value);
            } else {
              await updateRecord(form.value.id, form.value);
            }
            done(true);
            form.value = generateForm();
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

  /**
   * 展开/折叠
   *
   * @param type 类型（菜单
   */
  const handleExpandAll = () => {
    proxy.$refs.menuRef.expandAll(menuExpandAll.value);
  };

  /**
   * 全选/全不选
   *
   * @param type 类型（菜单
   */
  const handleCheckAll = () => {
    proxy.$refs.menuRef.checkAll(menuCheckAll.value);
  };
</script>
