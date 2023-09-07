<template>
  <a-layout-footer class="footer">
    {{ `Copyright © 2022-${new Date().getFullYear()}` }}&nbsp;
  </a-layout-footer>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: var(--color-text-2);
    text-align: center;
  }

  a {
    text-decoration: none;
    color: var(--color-text-2);
  }

  a:hover {
    color: rgb(var(--gray-6));
  }
</style>
