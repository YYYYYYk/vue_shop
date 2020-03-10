<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
            @change="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
          <!-- 添加用户弹出的表单 -->
          <el-dialog title="添加用户" :visible.sync="dialogFormVisible" @close="dialogClose">
            <el-form ref="registerRef"   :model="registerInfo" :rules="registerRules" label-width="70px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="registerInfo.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="registerInfo.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="registerInfo.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="registerInfo.mobile"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userList" border :stripe="true">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽的使用 -->
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getUserList();
  },
  data() {
      //验证邮箱规则
      var checkEmail=(rule,value,callback)=>{
          const regEmail= /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
          if(regEmail.test(value)){
              return callback()
          }
          callback(new Error('请输入合法的邮箱'))
      }
     //验证手机号规则
     var checkPhoneNum=(rule,value,callback)=>{
         const regMobile= /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
          if(regMobile.test(value)){
              return callback()
          }
          callback(new Error('请输入正确的手机号'))
     }
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        //当前每页展示多少条
        pagesize: 3
      },
      userList: [],
      total: 0,
      //注册时填写的表单信息
      dialogTableVisible: false,
      dialogFormVisible: false,
      registerInfo: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //注册时表单信息的验证
      registerRules: {
        username: [
          { required: true, message: "请输入用户名", triggle: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", triggle: "blur" },
          { min: 3, max: 10, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", triggle: "blur" },
          {validator:checkEmail,triggle:'blur'}
        ],
        mobile: [
          { required: true, message: "请输入手机号", triggle: "blur" },
           {validator:checkPhoneNum,triggle:'blur'}
          
        ]
      }
    };
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    //监听页数改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //具体页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //监听switch开关,更新用户状态
    async userStateChange(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败！");
      }
      this.$message.success("更新用户状态成功！");
    },
    //注册对话框关闭事件
    dialogClose(){
        this.$refs.registerRef.resetFields()
    },
    //注册对话框点击确定事件
   addUser(){
      //表单的预校验
      this.$refs.registerRef.validate(async valid=>{
          if(!valid)  return
          //校验成功后的操作
          const { data: res } = await this.$http.post(`users`, this.registerInfo)
          if(res.meta.status!==201){
              return this.$message.error("注册失败:"+res.meta.message);
          }
          this.dialogFormVisible=false;
          this.$message.success("注册成功");
          this.getUserList();
      })
  }
  }
};
</script>
<style lang="less" scoped>
</style>