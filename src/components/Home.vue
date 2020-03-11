<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/yk.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logOut">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse? '64px': '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menusList" :key="item.id">
            <!-- 模板区域  -->
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavStatus('/'+subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      // 菜单
      menusList: [],
      // 图标
      iconObj: {
        "125": "iconfont icon-users",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      //是否折叠
      isCollapse: false,
      //被激活的链接地址
      activePath: ""
    };
  },
  //创造生命周期函数
  created() {
    this.getMeuneList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    logOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMeuneList() {
      const { data: res } = await this.$http.get(`menus`); //需将数据私有化
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menusList = res.data;
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    //保存点击的路由地址实现高亮
    saveNavStatus(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    }
  }
};
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0; //header默认的内边距
  align-items: center; //按钮居中
  background-color: #373d41;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-header img {
  width: 50px;
  height: 50px;
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer; //鼠标效果
}
</style>