<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- steps进度条 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 表单区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tabs标签页--靠左侧展示 -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- 基本信息表单项 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 商品分类--级联选择器 -->
              <el-cascader
                expand-trigger="hover"
                :options="catelist"
                :props="cateProps"
                v-model="addForm.goods_cat"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染商品参数的Item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传模块 action:图片要上传的API地址,list-type:图片展示形式-->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 副文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览"
               :visible.sync="previewVisible"
              >
              <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>
<script>
// import _ from 'lodash'  loadash插件
export default {
  data() {
    return {
      activeIndex: 0,
      // 添加商品的表单数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        //上传图片的数组
        pics:[],
        //商品详情描述
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      // 商品分类列表
      catelist: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      //图片上传的接口地址
      uploadURL:'http://47.115.124.102:8888/api/private/v1/upload',
      //图片上传组件配置请求头
      headerObj:{
        Authorization: window.sessionStorage.getItem('token')
      },
      //图片预览
      previewPath: '',
      previewVisible: false
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败！");
      }

      this.catelist = res.data;
      console.log(this.catelist);
    },
    // 级联选择器选中项变化，会触发这个函数
    handleChange() {
      console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    //tags栏切换前判断限制
    beforeTabLeave(activeName, oldActiveName) {
      // console.log('即将离开的标签页名字是：' + oldActiveName)
      // console.log('即将进入的标签页名字是：' + activeName)
      // return false
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类！");
        return false;
      }
      if (oldActiveName === "0" && this.addForm.goods_name.trim() == "") {
        this.$message.error("请填写商品名称！");
        return false;
      }
    },
    //tags栏点击切换事件
    async tabClicked() {
      // console.log(this.activeIndex)
      // 证明访问的是动态参数面板
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数列表失败！");
        }
        console.log(res.data);
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        //静态属性面版
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取静态属性失败！");
        }
        console.log(res.data);
        this.onlyTableData = res.data;
      }
    },
    //图片上传后点击事件
    handlePreview(file){
      // console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    //图片移除事件
    handleRemove(file){
      console.log(file)
      // 1.获取要删除的图片路径
      const filePath=file.response.data.tmp_path;
      // 2.获取该路径的索引值???
      const i=this.addForm.pics.findIndex(x=>x.pic==filePath)
      // 3.根据索引值删除该图片
      this.addForm.pics.splice(i,1)
    },
    //图片上传成功事件
    handleSuccess(response){
      // console.log(response)
      // 1.建立一个对象
      const picInfo={pic:response.data.tmp_path}
      // 2.将该对象push到数组中
      this.addForm.pics.push(picInfo);
      // console.log(this.addForm)
    },
    //添加商品
    add(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid){
          return this.$message.error('请填写必要的表单项！')
        }
        //深拷贝??lodash,cloneDeep(obj)  改用json方法来实现深拷贝
        // const form = _.cloneDeep(this.addForm)
        let form=JSON.parse(JSON.stringify(this.addForm))
        form.goods_cat = form.goods_cat.join(',')
        //动态处理参数
        this.manyTableData.forEach(item=>{
          let newInfo={
            attr_id:item.attr_id,
            attr_value:item.attr_value.join(',')
          }
          this.addForm.attrs.push(newInfo)
        })
         //动态处理参数
        this.onlyTableData.forEach(item=>{
          let newInfo={
            attr_id:item.attr_id,
            attr_value:item.attr_value.join(',')
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
         if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  }
};
</script>
<style lang="less" scoped>
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>