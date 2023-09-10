<template>
  <div class="app-container">
    <Breadcrumb :items="['系统管理', '角色管理']" />
    <a-card class="general-card" title="角色管理">
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
                <a-form-item field="name" label="名称">
                  <a-input v-model="queryParams.name" placeholder="名称" />
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
        :pagination="{
          showTotal: true,
          showPageSize: true,
          total: total,
          current: queryParams.page,
        }"
        bordered
        :default-expand-all-rows="true"
        :hide-expand-button-on-empty="true"
        column-resizable
        stripe
        size="large"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #columns>
          <a-table-column title="ID" data-index="id" />
          <a-table-column title="角色名称" data-index="name" :width="130">
            <template #cell="{ record }">
              <a-link>{{ record.name }}</a-link>
            </template>
          </a-table-column>
          <a-table-column title="角色编码" data-index="code" />

          <a-table-column title="状态" align="center" data-index="status">
            <template #cell="{ record }">
              <a-switch
                v-model="record.status"
                :checked-value="1"
                :unchecked-value="0"
              />
            </template>
          </a-table-column>
          <a-table-column title="描述" data-index="description" tooltip />
          <a-table-column title="创建时间" data-index="created_at" />
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
                content="确定要删除当前选中的数据吗？"
                type="warning"
                @ok="handleDelete([record.id])"
              >
                <a-button
                  type="text"
                  size="small"
                  title="删除"
                  :disabled="record.disabled"
                >
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
  import { DataRecord, ListParam, list, del } from '@/api/system/role';

  import FormModal from './components/form-modal.vue';

  const { proxy } = getCurrentInstance() as any;

  const dataList = ref<DataRecord[]>([]);

  const total = ref(0);
  const loading = ref(false);
  const modalVisble = ref(false);

  const data = reactive({
    // 查询参数
    queryParams: {
      name: undefined,
      status: undefined,
      page: 1,
      size: 10,
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
        dataList.value = res.data.list;
        total.value = res.data.total;
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

  /**
   * 切换页码
   *
   * @param current 页码
   */
  const handlePageChange = (current: number) => {
    queryParams.value.page = current;
    getList();
  };

  /**
   * 切换每页条数
   *
   * @param pageSize 每页条数
   */
  const handlePageSizeChange = (pageSize: number) => {
    queryParams.value.size = pageSize;
    getList();
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
    name: 'Role',
  };
</script>

<style scoped lang="less"></style>
