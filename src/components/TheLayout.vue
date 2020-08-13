<template>
  <div class="page">
    <div
      class="page-header"
      :style="[
        { backgroundColor: headerBackgroundColor, boxShadow: headerBoxShadow }
      ]"
    >
      <div class="page-header-container">
        <div class="page-header-left">
          <img class="page-header-logo" src="@/assets/images/logo.png" />
        </div>
        <el-dropdown style="height: 100%" @command="handleCommand">
          <div class="page-header-right">
            <img class="user-avatar" :src="userAvatar" />
            <span class="nick-name">{{ userName }}</span>
            <i class="el-icon-arrow-down"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <div class="user-info">
              <img class="user-info-avatar" :src="userAvatar" />
              <p class="user-info-name">{{ userName }}</p>
              <p class="user-info-line"></p>
            </div>
            <el-dropdown-item style="text-align: center" command="handleLogout">
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="page-body">
      <div class="page-sidebar">
        <div class="sidebar-header">
          <img class="user-avatar" :src="userAvatar" />
          <p class="user-name">{{ userName }}</p>
        </div>
        <div class="sidebar-nav">
          <el-menu
            :background-color="navBackgroundColor"
            :text-color="navTextColor"
            :active-text-color="navActiveTextColor"
            :default-active="navDefaultActive"
            :router="true"
          >
            <template v-for="route in navRoutes">
              <el-menu-item
                v-if="!haveChildren(route)"
                :key="route.name"
                :index="route.name"
                :route="{ name: route.name }"
              >
                <i v-if="route.meta.nav.icon" :class="route.meta.nav.icon"></i>
                <icon-svg
                  v-if="route.meta.nav.svg"
                  :svg-class="route.meta.nav.svg.class"
                  :svg-name="route.meta.nav.svg.name"
                ></icon-svg>
                <span slot="title">{{ route.meta.nav.title }}</span>
              </el-menu-item>
              <el-submenu
                class="el-submenu-level_1"
                v-else
                :key="route.name"
                :index="route.name"
              >
                <template slot="title">
                  <i
                    v-if="route.meta.nav.icon"
                    :class="route.meta.nav.icon"
                  ></i>
                  <icon-svg
                    v-if="route.meta.nav.svg"
                    :svg-class="route.meta.nav.svg.class"
                    :svg-name="route.meta.nav.svg.name"
                  ></icon-svg>
                  <span>{{ route.meta.nav.title }}</span>
                </template>

                <template v-for="item in route.children">
                  <el-menu-item
                    v-if="!haveChildren(item)"
                    :key="item.name"
                    :index="item.name"
                    :route="{ name: item.name }"
                  >
                    <!-- <i
                      v-if="item.meta.nav.icon"
                      :class="item.meta.nav.icon"
                    ></i> -->
                    <span class="fa-dot"></span>
                    <span>{{ item.meta.nav.title }}</span>
                  </el-menu-item>
                  <el-submenu
                    class="el-submenu-level_2"
                    v-else
                    :key="item.name"
                    :index="item.name"
                  >
                    <template slot="title">
                      <!-- <i
                        v-if="item.meta.nav.icon"
                        :class="item.meta.nav.icon"
                      ></i> -->
                      <span class="fa-diamond"></span>
                      <span>{{ item.meta.nav.title }}</span>
                    </template>
                    <el-menu-item
                      v-for="data in item.children"
                      :key="data.name"
                      :index="data.name"
                      :route="{ name: data.name }"
                    >
                      <!-- <i
                        v-if="data.meta.nav.icon"
                        :class="data.meta.nav.icon"
                      ></i> -->
                      <span class="fa-dot"></span>
                      <span>{{ data.meta.nav.title }}</span>
                    </el-menu-item>
                  </el-submenu>
                </template>
              </el-submenu>
            </template>
          </el-menu>
        </div>
        <div class="sidebar-footer">
          <p class="sidebar-footer-line"></p>
          <span class="sidebar-footer-content">内容反馈</span>
          <span class="sidebar-footer-content">关于我们</span>
          <p class="sidebar-footer-copyright">© 2020 Jiker.com</p>
        </div>
      </div>
      <div class="page-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import routesAll from "@/router/routes";

export default {
  data() {
    return {
      headerBackgroundColor: "#fff",
      headerBoxShadow: "0 1px 2px 0 rgba(0, 0, 0, .06)",
      navBackgroundColor: "",
      navTextColor: "",
      navActiveTextColor: "",
      navDefaultActive: this.$route.name,
      navRoutes: []
    };
  },
  computed: {
    ...mapState(["userAvatar", "userName", "authPermissions"])
  },
  created() {
    this.getRoutes();
  },
  methods: {
    getRoutes() {
      let resultRoutes = this.filterPermissionRoutes(
        routesAll,
        this.authPermissions
      );
      this.navRoutes = this.filterRoutes(resultRoutes);
    },
    filterPermissionRoutes(routes, permissions) {
      const filterRoutes = [];
      routes.forEach(data => {
        const route = { ...data };
        const notPermission = !route.permission;
        const hasPermission = permissions.includes(route.permission);
        const passPermission = notPermission || hasPermission;
        let hasPath = true;
        if (route.children) {
          route.children = this.filterPermissionRoutes(
            data.children,
            permissions
          );
          if (route.children.length === 0) {
            hasPath = false;
          }
        }
        if (passPermission && hasPath) {
          filterRoutes.push(route);
        }
      });
      return filterRoutes;
    },
    filterRoutes(routes) {
      let result = [];
      routes.forEach(data => {
        if (data.meta && data.meta.nav) {
          let item = {
            name: data.name,
            meta: data.meta
          };
          if (data.children) {
            item.children = this.filterRoutes(data.children);
          }
          result.push(item);
        } else if (data.children) {
          this.filterRoutes(data.children).forEach(item => {
            result.push(item);
          });
        }
      });
      return result;
    },
    haveChildren(route) {
      let children = route.children || [];
      return children.length;
    },
    handleCommand(command) {
      this[command]();
    },
    handleLogout() {
      this.$store.dispatch("logout");
    }
  }
};
</script>
<style lang="less" scoped>
.nav-svg {
  margin-right: 5px;
  width: 24px;
  height: 18px;
  vertical-align: middle;
  color: #909399;
}
.el-menu-item.is-active .nav-svg {
  color: #409eff;
}

.user-info {
  width: 150px;
  .user-info-avatar {
    display: block;
    margin: 24px auto 12px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .user-info-name {
    margin-bottom: 24px;
    font-size: 14px;
    color: #606266;
    text-align: center;
  }
  .user-info-line {
    margin-bottom: 10px;
    height: 1px;
    width: 100%;
    background: rgba(0, 0, 0, 0.05);
  }
}

.page {
  min-width: 1280px;
  .page-header {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 100;
    height: 72px;
    .page-header-container {
      display: flex;
      justify-content: space-between;
      margin: 0 auto;
      width: 1280px;
      height: 100%;
      line-height: 40px;
      .page-header-left {
        display: flex;
        margin-top: 16px;
        .page-header-logo {
          height: 40px;
        }
      }
      .page-header-right {
        display: flex;
        align-items: center;
        padding: 0 20px;
        height: 100%;
        transition: all 0.2s ease;
        cursor: pointer;
        &:hover {
          background: #ecf5ff;
        }
        .user-avatar {
          margin-right: 12px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .user-name {
          margin-right: 12px;
          font-size: 14px;
        }
      }
    }
  }
  .page-body {
    display: flex;
    margin: 20px auto;
    width: 1280px;
    .page-sidebar {
      position: sticky;
      top: 92px;
      display: flex;
      flex-direction: column;
      flex: none;
      margin-right: 20px;
      width: 260px;
      height: 100%;
      background: #fff;
      .sidebar-header {
        flex: none;
        text-align: center;
        .user-avatar {
          display: block;
          margin: 36px auto 24px;
          width: 144px;
          height: 144px;
          border-radius: 50%;
        }
        .user-name {
          margin-bottom: 12px;
          font-size: 26px;
          line-height: 30px;
          color: #303133;
        }
      }
      .sidebar-nav {
        flex: 1;
      }
      .sidebar-footer {
        flex: none;
        font-size: 12px;
        text-align: center;
        color: #999;
        .sidebar-footer-line {
          margin: 20px 0;
          height: 1px;
          width: 100%;
          background: rgba(0, 0, 0, 0.05);
        }
        .sidebar-footer-content {
          margin: 0 6px;
          line-height: 40px;
          cursor: pointer;
        }
        .sidebar-footer-copyright {
          margin-bottom: 32px;
        }
      }
    }
    .page-content {
      flex: none;
      padding: 30px;
      width: 1000px;
      height: 100%;
      min-height: 600px;
      background: #fff;
    }
  }
}
</style>
