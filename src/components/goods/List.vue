<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            clearable
            @clear="getGoodsList"
            @change="getGoodsList"
          >
          <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" size="medium" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品表格区域 -->
      <el-table :data="goodslist" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="95px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140px">
          <!-- 这里的创建时间需格式化输出下 | 全局过滤器 -->
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="goods_name" label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部页码区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5,10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodslist: [],
      // 总数据条数
      total: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败！");
      }

      this.$message.success("获取商品列表成功！");
      console.log(res.data);
      this.goodslist = res.data.goods;
      this.total = res.data.total;
    },
    //监听页数改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    //具体页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    //删除商品
    async removeById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("已经取消删除！");
      }

      const { data: res } = await this.$http.delete(`goods/${id}`);

      if (res.meta.status !== 200) {
        return this.$message.error("删除失败！");
      }

      this.$message.success("删除成功！");
      this.getGoodsList();
    },
    goAddpage(){
      this.$router.push('goods/add')
    }
  }
};
</script>
<style lang="less" scoped>
// 通过:gutter来设置
// .el-button{
//   margin-left: 20px;
// }
</style>