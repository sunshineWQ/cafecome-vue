<template>
    <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
        <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card class="box-card">

    <div style="margin-top: 15px;">
       <!--搜索框区域-->
         <el-row :gutter="20">
                <el-col :span="8">
                    <el-input  :span="8" placeholder="请输入内容"  v-model="queryInfo.phone">         
                        <el-button slot="append" icon="el-icon-search"  @click="getAdminList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                        <el-button type="primary"  @click="dialogVisible = true">添加管理员</el-button>
                </el-col>              
        </el-row>
        <!--数据列表区域-->
            <el-table :data="adminList"  style="width: 100%"  :row-style="{height:'0'}"  :cell-style="{padding:'3'}"
            :default-sort = "{prop: 'createdTime', order: 'descending'}">
                <el-table-column  type="index"  label="序号" sortable  width="180"></el-table-column>
                <el-table-column  prop="name"      label="管理员姓名"></el-table-column>
                <el-table-column  prop="phone"      label="手机号"></el-table-column>
                <el-table-column  prop="admin_type" label="状态">
               <!--作用域插槽-->
               <template   slot-scope="scope">  
                        <el-switch
                                v-model="scope.row.state"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                @change="adminstatusChange(scope.row)">
                        </el-switch>
               </template>
                </el-table-column>
                <el-table-column prop="createdTime" label="添加日期" ></el-table-column>
                <el-table-column  label="操作" >
                    <template  slot-scope="scope">
                        <el-row>
                        <el-tooltip class="item" effect="dark"  content="编辑" placement="top-start">
                             <el-button type="primary" icon="el-icon-edit" circle  @click="editdialogVisible(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="修改权限" placement="top-start">
                                <el-button type="warning" icon="el-icon-share" circle></el-button>
                        </el-tooltip>
                        
                         <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                             
                                <el-button type="danger" @click="delAdmin(scope.row)" icon="el-icon-delete" circle></el-button>
                               
                        </el-tooltip>
                       
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
                 <!--分页组件-->
                 <el-pagination
                          @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                          :current-page="this.queryInfo.currentPage"
                          :page-sizes="[2,5,10]"
                          :page-size="5"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total=total>
                </el-pagination>
                <!--添加管理员列表弹窗-->
                <el-dialog
                        title="添加管理员"
                        :visible.sync="dialogVisible"
                         width="30%"
                        :before-close="handleClose"
                        @close="dialogClose">
                       <el-form   :model="addDialogForm"  :rules="rules"  ref="addDialogForm"   label-width="120px">
                            <el-form-item label="管理员姓名"  prop="name">
                                <el-input   v-model="addDialogForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="管理员手机号"  prop="phone">
                                <el-input   v-model="addDialogForm.phone"></el-input>
                            </el-form-item>
                            <el-form-item label="管理员密码"  prop="password">
                                <el-input   v-model="addDialogForm.password"></el-input>
                            </el-form-item>

                            <el-form-item label="管理员类型">
                                <el-select  v-model="addDialogForm.admin_type" placeholder="请选择管理员类型">
                                <el-option label="发现管理员"  value=0></el-option>
                                <el-option label="社区管理员"  value=1></el-option>
                                <el-option label="商家管理员"  value=2></el-option>
                                </el-select>
                            </el-form-item>
                
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="addAdmin('addDialogForm')">确 定</el-button>
                        </span>
                </el-dialog>
                <!--编辑管理员弹窗-->

                <el-dialog
                        title="编辑管理员"
                        :visible.sync="editdialog"
                         width="30%"
                       
                        @close="dialogClose">
                        <el-form  :model="editDialogForm" :rules="editDialogFormRrules"  ref="editDialogForm"   label-width="120px">
                            <el-form-item label="管理员姓名"  prop="name">
                                <el-input   v-model="editDialogForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="管理员手机号"  prop="phone">
                                <el-input   v-model="editDialogForm.phone"></el-input>
                            </el-form-item>
                            <el-form-item label="管理员密码"  prop="password">
                                <el-input   v-model="editDialogForm.password"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="editdialog = false">取 消</el-button>
                            <el-button type="primary" @click="editAdmin('editDialogForm')">确 定</el-button>
                        </span>
                </el-dialog>

  </div>
</el-card>
    </div>
</template>


<script>
    export default {
     data(){
         //自定义验证手机号的规则
         var checkPhone=(rule, value, ce)=>{
             const  regPhone= /^[1][3,4,5,7,8][0-9]{9}$/
             if(regPhone.test(value)){
               return  ce()
             }
             ce(new  Error('手机号格式不正确'))
         }
         //验证手机号是否重复
         var  checkMobile=async(rule,value,cu)=>{
            const  {data:res}=await  this.$http.get("user/queryPhoneCount",
            {
                params:{
                    'value':value
                }
            }
            )
           console.log(res)
            if(res.code==200){
             return  cu(new  Error('手机号不能重复'))
            }
        
         }
         return{
             //获取管理员列表所需的参数对象
             queryInfo:{
                 phone:'',
                 currentPage:1,
                 rows:5
             },
             //从java方法中中获取的数值
             adminList:[],   //管理员列表
             total:0,
             dialogVisible: false, //添加管理员列表弹框初始值
             editdialog:false,

             //添加表单(管理员)需要的数据
             addDialogForm:{
                 name:'',
                 Phone:'',
                 password:'',
                 admin_type:''
             },
             //编辑表单需要得数据
             editDialogForm:{
                aid:'',
                name:'',
                phone:'',
                password:''
             },
            
             editDialogFormRrules:{
                name:[
                        { required: true, message: '请输入管理员姓名', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                phone:[
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { validator: checkPhone, trigger: 'blur'}
                ],
                 password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur' }
                ]
             },
              rules:{
              name: [
                { required: true, message: '请输入管理员姓名', trigger: 'blur' },
                { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
             phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkPhone, trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur'}
                 ],
            password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur' }
                ]
            },
         }

     },

    
     created(){
       this.getAdminList()
     },
     methods:{
         //监听弹框关闭
         dialogClose(){
             this.$refs.addDialogForm.resetFields();  //重置表单数据    
         },
        async  getAdminList(){
           
                const {data:res}=await this.$http.get("user/queryAllAdmin",{params:this.queryInfo})
                console.log(res.code)
                if(res.code==200){
                    this.adminList=res.data.list;
                    this.total=res.data.totalCount;
                    console.log(this.adminList);               
                }   
          },
          //触发删除的操作
          delAdmin(adminInfoo){
           console.log("xxx:"+adminInfoo.aid)
           this.$confirm('此操作将永久删除该文件, 是否继续?', '提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
           }).then(async()=>{
                 const  {data:res}=await this.$http.get("user/delAdmin",
                {params:{
               'aid':adminInfoo.aid
                }}
           )    
           if(res.code==200){
                 this.getAdminList();
             this.$message.success("删除成功");
             
           }else{
               this.$message.error("删除失败")
           }
           })
      
          },
          //监听尺寸的改变
          handleSizeChange(newsize){
             this.queryInfo.rows=newsize;
             this.getAdminList()
          },
          //监听页码的改变
          handleCurrentChange(newpage){
              console.log(newpage)
               this.queryInfo.currentPage=newpage;
             this.getAdminList()
          },

        formatter(row, column) {
        return row.address;
      },
      //监听switch  开关得状态
     async adminstatusChange(adminInfo){
         const {data:res}=await this.$http.put('user/updateAdminStatus/'+adminInfo.aid+'/status/'+adminInfo.state)
         if(res.code==200){
            this.$message.success("状态修改成功")
         }else{
             this.$message.error("状态修改失败")
         }
         
      },


    //   handleClose(done) {
    //     this.$confirm('确认关闭？')
    //       .then(_ => {
    //         done();
    //       })
    //       .catch(_ => {});
    //   },
      //点击确定 要触发的方法  添加管理员
    async  addAdmin(addDialogForm){
    this.$refs.addDialogForm.validate(async valid => {
        console.log(valid)
          if (!valid) return  //没有验证通过
        //验证通过  可以发起请求
         const {data:res}=await this.$http.get('user/addAdmin',{params:this.addDialogForm})
              if(res.code==201){
                this.$message.success("添加成功");
               this.getAdminList();
                 this.dialogVisible = false
             }
          
          
        });
      },
      //点击编辑触发得方法
   async  editdialogVisible(info){
         this.editdialog=!this.editdialog
         console.log("ggg"+info.aid)
         const {data:res}=await this.$http.get('user/queryAdminByid',{
             params:{
                 'aid':info.aid
             }
         })
         console.log(res)
         if(res.code==200){
             this.editDialogForm=res.data;
             console.log(this.editDialogForm)
         }
      },
      //点击编辑里的确定  触发的操作
        async editAdmin(editInfo){
         this.$refs.editDialogForm.validate(async valid => {
        console.log(valid)
          if (!valid) return  //没有验证通过
        //验证通过  可以发起请求
         const {data:res}=await this.$http.get('user/updateAdminMessage',{params:this.editDialogForm})
         console.log(res.code)
              if(res.code==200){
                this.$message.success("修改成功");
               this.getAdminList();
                 this.editdialog = false
             }else{
                 this.editdialog=false
             }
          
          
        });

      }
     }
    }
</script>
<style lang="less" scoped>

</style>

