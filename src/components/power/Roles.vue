<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- button最好栅格内 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表内容区 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <!-- 栅格布局强！ -->
            <el-row
              :class="['borderBottom',i1===0?'borderTop':'','vcenter']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限渲染 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限渲染 -->
              <el-col :span="19">
                <el-row
                  :class="[i2===0?'':'borderTop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      v-for="(item3,i3) in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{scope.row}}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="warning" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button
              type="danger"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%"  @close="setRightDialogClosed">
      <!-- 树形控件nb -->
      <el-tree
      ref="treeRef"
      show-checkbox
      default-expand-all
      :default-checked-keys="defKeys"
        :data="rightList"
        :props="treeProps"
        node-key="id"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //所有角色数据
      rolelist: [],
      //分配权限对话框
      setRightDialogVisible: false,
      //所有权限的数据
      rightList:[],
      //树形控件的属性绑定控件
      treeProps:{
        children:'children',
        label:'authName'
      },
      //默认选择的节点的id值
      defKeys:[],
      // 当前即将分配权限的角色id
      roleId: ''
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      }
      this.rolelist = res.data;
    },
    //根据id删除相应权限
    removeRightById(role, rightId) {
      //弹框提示
      this.$confirm("此操作将永久删除该角色权限,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async ress => {
          //注意请求的方式用反引号`
          const { data: res } = await this.$http.delete(
            `/roles/${role.id}/rights/${rightId}`
          );
          if (res.meta.status !== 200) {
            return this.$message.error("删除角色权限失败!");
          }
          // this.getRolesList(); 调此函数会发送页面的刷新跳转，不建议
          //还能直接这样实时刷新？？？
          role.children = res.data;

          this.$message.success("删除角色权限成功!");
        })
        .catch(error => {
          this.$message.info("已取消删除");
        });
    },
    //展示分配权限对话框
    async showSetRightDialog(row){
      this.roleId = row.id
      //获取所有权限数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败！");
      }
      this.rightList=res.data;
      this.getLeafKeys(row,this.defKeys);
      this.setRightDialogVisible=true
    },
    //通过递归的形式获取所有三级权限的id，并保存至defKeys中
    getLeafKeys(node,arr){
      //当前node节点不包含childern属性，则是三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      //遍历子节点children
      node.children.forEach(item=>{
       this.getLeafKeys(item,arr) 
      })
    },
    //分配权限对话框关闭需置空defKeys
    setRightDialogClosed(){
      this.defKeys=[]
    },
    //确认分配角色
    async allotRights(){
      const keys=[...this.$refs.treeRef.getCheckedKeys(),
      ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      //数组转换为字符串
      const idStr=keys.join(',');
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.borderBottom {
  border-bottom: 1px solid #eee;
}
.borderTop {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>