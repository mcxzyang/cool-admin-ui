<template>
  <div class="root">
    <div class="header">
      <img
        src="https://cnadmin.charles7c.top/logo.svg"
        alt="logo"
        height="33"
      />
      <div class="logo-text">Cool Admin</div>
    </div>
    <div class="container">
      <div class="left-banner"></div>
      <div class="login-card">
        <div class="title"> 欢迎来到 Cool Admin </div>
        <AccountLogin />
      </div>
    </div>
    <div class="footer">
      <!-- <div class="beian">
        <div class="below text" v-html="appStore.getCopyright"></div>
      </div> -->
      <Footer />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Footer from '@/components/footer/index.vue';
  // import { ref } from 'vue';
  // import { useAppStore } from '@/store';
  import useResponsive from '@/hooks/responsive';
  // import getFile from '@/utils/file';
  import AccountLogin from './components/account-login.vue';
  // import PhoneLogin from './components/phone-login.vue';
  // import EmailLogin from './components/email-login.vue';

  // const appStore = useAppStore();
  useResponsive(true);
  // const isEmailLogin = ref(false);

  // const toggleLoginMode = () => {
  //   isEmailLogin.value = !isEmailLogin.value;
  // };
</script>

<style lang="less" scoped>
  .root {
    background-image: url(https://z1.ax1x.com/2023/09/27/pPbnTOK.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    min-height: 100vh;

    a {
      color: #3370ff;
      cursor: pointer !important;
      text-decoration: none;
    }

    a:hover {
      color: #6694ff;
    }

    .header {
      padding: 32px 40px 0;
      img {
        vertical-align: middle;
      }
      .logo-text {
        display: inline-block;
        margin-right: 4px;
        margin-left: 4px;
        color: var(--color-text-1);
        font-size: 24px;
        vertical-align: middle;
      }
    }

    .container {
      align-items: center;
      box-sizing: border-box;
      display: flex;
      height: calc(100vh - 100px);
      justify-content: center;
      margin: 0 auto;
      max-width: 1200px;
      min-height: 650px;
      .left-banner {
        flex: 1 1;
        height: 100%;
        max-height: 700px;
        position: relative;
        img {
          height: 100%;
          left: 0;
          max-height: 350px;
          max-width: 500px;
          object-fit: contain;
          position: absolute;
          top: 4.5%;
          width: 100%;
        }
      }
      .login-card {
        display: flex;
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        box-sizing: border-box;
        // min-height: 500px;
        position: relative;
        width: 450px;
        flex-direction: column;
        // margin-bottom: 53px;
        padding: 48px 43px 32px;
        .title {
          color: #020814;
          font-size: 24px;
          font-weight: 500;
          letter-spacing: 0.003em;
          line-height: 32px;
          padding: 0 5px;
        }
        .account-tab {
          margin-top: 36px;
          :deep(.arco-tabs-nav::before) {
            display: none;
          }
          :deep(.arco-tabs-tab-title) {
            font-size: 16px;
            font-weight: 500;
            line-height: 22px;
            display: inline-block;
            padding: 1px 0;
            position: relative;
          }
          :deep(.arco-tabs-tab-title:hover) {
            color: rgb(var(--primary-6));
          }
          :deep(.arco-tabs-tab-title:before) {
            display: none;
          }
          :deep(.arco-tabs-tab) {
            margin: 0 30px 0 6px;
          }
        }

        .oauth {
          margin-top: 20px;
          padding: 0 5px;
          :deep(.arco-divider-text) {
            color: #80838a;
            font-size: 12px;
            font-weight: 400;
            line-height: 20px;
          }
          :deep(.arco-divider) {
            margin-bottom: 25px;
          }
          .idps {
            align-items: center;
            display: flex;
            justify-content: center;
            width: 100%;
            .app {
              margin-right: 12px;
              align-items: center;
              border: 1px solid #eaedf1;
              border-radius: 32px;
              box-sizing: border-box;
              display: flex;
              height: 32px;
              justify-content: center;
              width: 32px;
              cursor: pointer;
              .icon {
                width: 21px;
                height: 20px;
              }
            }
            .app:hover {
              background: #f3f7ff;
              border: 1px solid #97bcff;
            }
            .mail {
              min-width: 81px;
              width: 81px;
            }
            .account {
              min-width: 147px;
              width: 147px;
            }
            .mail,
            .account {
              color: #41464f;
              font-size: 12px;
              font-weight: 400;
              line-height: 20px;
              padding: 6px 10px;
            }
            .mail svg,
            .account svg {
              font-size: 16px;
              margin-right: 10px;
            }
            .mail:hover,
            .account:hover {
              color: rgb(var(--primary-6));
            }
            .mail svg:hover,
            .account svg:hover {
              color: rgb(var(--primary-6));
            }
          }
        }
      }
    }

    .footer {
      align-items: center;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      .beian {
        .text {
          color: #41464f;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.2px;
          line-height: 20px;
          text-align: center;
        }
        .below {
          align-items: center;
          display: flex;
        }
      }
    }
  }
</style>
