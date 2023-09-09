<template>
  <!-- 表单区域 -->
  <a-modal
    :visible="visible"
    width="60%"
    :mask-closable="false"
    :esc-to-close="false"
    unmount-on-close
    render-to-body
    @cancel="handleCancel"
    @before-ok="handleBeforeOk"
  >
    <template #title> {{ form.id ? '编辑' : '创建' }} </template>
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      layout="inline"
      :label-col-style="{ width: '85px' }"
      size="large"
    >
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="菜单类型" field="type" lab>
            <a-radio-group v-model="form.type" type="button">
              <a-radio :value="1" style="width: 57px">菜单</a-radio>
              <a-radio :value="2" style="width: 57px">按钮</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item v-if="form.type === 1" label="菜单图标" field="icon">
            <a-popover
              v-model:popup-visible="showChooseIcon"
              position="bottom"
              trigger="click"
            >
              <a-input
                v-model="form.icon"
                placeholder="点击选择菜单图标"
                readonly
                allow-clear
              >
                <template #prefix>
                  <svg-icon
                    v-if="form.icon"
                    :icon-class="form.icon"
                    style="height: 32px; width: 16px"
                  />
                  <icon-search v-else />
                </template>
              </a-input>
              <template #content>
                <icon-select ref="iconSelectRef" @selected="selected" />
              </template>
            </a-popover>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="菜单标题" field="title">
            <a-input v-model="form.title" placeholder="请输入菜单标题" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="菜单排序" field="sort">
            <a-input-number
              v-model="form.sort"
              placeholder="请输入菜单排序"
              :min="1"
              mode="button"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="权限标识" field="permission">
            <a-input
              v-model="form.permission"
              :disabled="form.type === 1"
              placeholder="请输入权限标识"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item v-if="form.type === 1" label="路由地址" field="path">
            <a-input
              v-model="form.path"
              placeholder="请输入路由地址"
              style="width: 473px"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            v-if="!form.isExternal && form.type === 1"
            label="组件名称"
            field="name"
          >
            <a-input
              v-model="form.name"
              placeholder="请输入组件名称"
            /> </a-form-item
        ></a-col>
        <a-col :span="12">
          <a-form-item
            v-if="!form.isExternal && form.type === 1"
            label="组件路径"
            field="component"
          >
            <a-input v-model="form.component" placeholder="请输入组件路径" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            v-if="form.type === 1"
            label="是否缓存"
            field="ignoreCache"
          >
            <a-radio-group v-model="form.ignoreCache" type="button">
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            v-if="form.type === 1"
            label="是否隐藏"
            field="hideInMenu"
          >
            <a-radio-group v-model="form.hideInMenu" type="button">
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="上级菜单" field="pid">
            <a-tree-select
              v-model="form.pid"
              :data="treeData"
              placeholder="请选择上级菜单"
              allow-clear
              allow-search
              :filter-tree-node="filterMenuTree"
              :fallback-option="false"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref, watch, reactive, toRefs, getCurrentInstance } from 'vue';
  import { cloneDeep, isEmpty } from 'lodash';
  import { Message, TreeNodeData } from '@arco-design/web-vue';
  import { addRecord, updateRecord, DataRecord } from '@/api/system/menu';

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
    treeData: {
      type: Object,
      default: () => null,
    },
  });

  const modalVisible = ref(false);
  const showChooseIcon = ref(false);
  const emit = defineEmits(['update-visible', 'update-success']);

  const generateForm = () => {
    return {
      id: undefined,
      title: '',
      pid: undefined,
      type: 1,
      path: undefined,
      name: undefined,
      component: undefined,
      icon: undefined,
      ignoreCache: false,
      hideInMenu: false,
      permission: undefined,
      sort: 999,
      status: 1,
    };
  };

  const form = ref({});

  const data = reactive({
    rules: {
      title: [{ required: true, message: '请输入菜单标题' }],
      // path: [{ required: true, message: '请输入路由地址' }],
      // name: [{ required: true, message: '请输入组件名称' }],
      sort: [{ required: true, message: '请输入菜单排序' }],
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
      form.value = isEmpty(value)
        ? generateForm()
        : (cloneDeep(value) as DataRecord);
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
   * 选择图标
   *
   * @param name 图标名称
   */
  const selected = (name: string) => {
    form.value.icon = name;
    showChooseIcon.value = false;
  };

  /**
   * 过滤菜单树
   *
   * @param searchValue 搜索值
   * @param nodeData 节点值
   */
  const filterMenuTree = (searchValue: string, nodeData: TreeNodeData) => {
    if (nodeData.title) {
      return (
        nodeData.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
      );
    }
    return false;
  };
</script>
