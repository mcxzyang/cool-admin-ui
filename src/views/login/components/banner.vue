<template>
  <div class="banner">
    <div class="banner-inner">
      <a-carousel class="carousel" animation-name="fade">
        <a-carousel-item v-for="item in carouselItem" :key="item.slogan">
          <div :key="item.slogan" class="carousel-item">
            <div class="carousel-title">{{ item.slogan }}</div>
            <div class="carousel-sub-title">{{ item.subSlogan }}</div>
            <img class="carousel-image" :src="item.image" />
          </div>
        </a-carousel-item>
      </a-carousel>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import bannerImage1 from '@/assets/images/login/banner1.png';
  import bannerImage2 from '@/assets/images/login/banner2.png';
  import bannerImage3 from '@/assets/images/login/banner3.png';

  const carouselItem = computed(() => [
    {
      slogan: '中后台管理框架',
      subSlogan: '持续以最新流行技术栈构建，拥抱变化，迭代优化',
      image: bannerImage1,
    },
    {
      slogan: '内置了常见问题的解决方案',
      subSlogan: '基础功能丰富，使用门槛低，企业级快速开发脚手架',
      image: bannerImage2,
    },
    {
      slogan: '代码规范且开源免费',
      subSlogan: '前端代码使用严格的 ESLint 检查',
      image: bannerImage3,
    },
  ]);
</script>

<style lang="less" scoped>
  .banner {
    display: flex;
    align-items: center;
    justify-content: center;

    &-inner {
      flex: 1;
      height: 100%;
    }
  }

  .carousel {
    height: 100%;

    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    &-title {
      color: var(--color-fill-1);
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
    }

    &-sub-title {
      margin-top: 8px;
      margin-left: 30px;
      color: var(--color-text-3);
      font-size: 14px;
      line-height: 22px;
    }

    &-image {
      width: 360px;
      margin-top: 30px;
    }
  }
</style>
