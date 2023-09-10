<template>
  <div class="app-container">
    <Breadcrumb :items="['系统管理', '用户管理']" />
    <a-card class="general-card" title="用户管理">
      <a-row>
        <a-col :flex="1">
          <a-form
            ref="queryRef"
            :model="queryParams"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="title" label="标题">
                  <a-input v-model="queryParams.title" placeholder="用户名" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" label="状态">
                  <a-select
                    v-model="queryParams.status"
                    placeholder="状态"
                    allow-clear
                  >
                    <a-option :value="1">正常</a-option>
                    <a-option :value="0">禁用</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 40px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space :size="18">
            <a-button type="primary" @click="handleQuery">
              <template #icon>
                <icon-search />
              </template>
              搜索
            </a-button>
            <a-button @click="resetQuery">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleAdd">
              <template #icon>
                <icon-plus />
              </template>
              新增
            </a-button>
            <a-button type="secondary" @click="handleExpandAll">
              <template #icon><icon-swap :rotate="90" /></template>展开/折叠
            </a-button>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
        </a-col>
      </a-row>

      <!-- 列表区域 -->
      <a-table
        ref="tableRef"
        row-key="id"
        :data="dataList"
        :loading="loading"
        :pagination="false"
        bordered
        :default-expand-all-rows="true"
        :hide-expand-button-on-empty="true"
        column-resizable
        stripe
        size="large"
      >
        <template #columns>
          <a-table-column title="菜单标题" data-index="title" />
          <a-table-column title="图标" align="center">
            <template #cell="{ record }">
              <svg-icon :icon-class="record.icon ? record.icon : ''" />
            </template>
          </a-table-column>
          <a-table-column title="排序" align="center" data-index="sort" />
          <a-table-column title="权限标识" data-index="permission" />
          <a-table-column title="组件路径" data-index="component" />
          <a-table-column title="状态" align="center">
            <template #cell="{ record }">
              <a-switch
                v-model="record.status"
                :checked-value="1"
                :unchecked-value="2"
              />
            </template>
          </a-table-column>
          <a-table-column title="缓存" align="center">
            <template #cell="{ record }">
              <a-tag v-if="record.ignoreCache" color="arcoblue">是</a-tag>
              <a-tag v-else color="red">否</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="隐藏" align="center">
            <template #cell="{ record }">
              <a-tag v-if="record.hideInMenu" color="arcoblue">是</a-tag>
              <a-tag v-else color="red">否</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="操作" align="center">
            <template #cell="{ record }">
              <a-button
                type="text"
                size="small"
                title="修改"
                @click="handleEdit(record)"
              >
                <template #icon><icon-edit /></template>修改
              </a-button>
              <a-popconfirm
                content="确定要删除当前选中的数据吗？如果存在下级菜单则一并删除，此操作不能撤销！"
                type="warning"
                @ok="handleDelete([record.id])"
              >
                <a-button type="text" size="small" title="删除">
                  <template #icon><icon-delete /></template>删除
                </a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <FormModal
      :visible="modalVisble"
      :form-data="form"
      @update-visible="updateVisible"
      @update-success="updateSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, ref, toRefs, reactive } from 'vue';
  import { DataRecord, ListParam, list, del } from '@/api/system/menu';

  import FormModal from './components/form-modal.vue';

  const { proxy } = getCurrentInstance() as any;

  const dataList = ref<DataRecord[]>([]);

  const loading = ref(false);
  const modalVisble = ref(false);
  const expandAll = ref(false);

  const data = reactive({
    // 查询参数
    queryParams: {
      title: undefined,
      status: undefined,
    },
    // 表单数据
    form: {} as DataRecord,
  });
  const { queryParams, form } = toRefs(data);

  /**
   * 查询列表
   *
   * @param params 查询参数
   */
  const getList = (params: ListParam = { ...queryParams.value }) => {
    loading.value = true;
    list(params)
      .then((res) => {
        dataList.value = res.data;
      })
      .finally(() => {
        loading.value = false;
      });
  };
  getList();

  // 新增
  const handleAdd = () => {
    form.value = {} as DataRecord;
    modalVisble.value = true;
  };

  const handleEdit = (record: DataRecord) => {
    form.value = record;
    modalVisble.value = true;
  };

  /**
   * 展开/折叠
   */
  const handleExpandAll = () => {
    expandAll.value = !expandAll.value;
    proxy.$refs.tableRef.expandAll(expandAll.value);
  };

  /**
   * 删除
   *
   * @param ids ID 列表
   */
  const handleDelete = (ids: Array<string>) => {
    del(ids).then((res) => {
      proxy.$message.success(res.message);
      getList();
    });
  };

  /**
   * 查询
   */
  const handleQuery = () => {
    getList();
  };

  /**
   * 重置
   */
  const resetQuery = () => {
    proxy.$refs.queryRef.resetFields();
    handleQuery();
  };

  // 更新弹框状态
  const updateVisible = (visible: boolean) => {
    modalVisble.value = visible;
  };

  // 弹框操作成功
  const updateSuccess = () => {
    modalVisble.value = false;
    getList();
  };
</script>

<script lang="ts">
  export default {
    // eslint-disable-next-line vue/no-reserved-component-names
    name: 'Menu',
  };
</script>

<style scoped lang="less"></style>
