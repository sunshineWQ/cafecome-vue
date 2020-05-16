<template>
    <div>
         <!--面包屑导航-->
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <!--添加角色按钮-->
          <el-row>
              <el-col :span="4">
                        <el-button type="primary">添加角色</el-button>
            </el-col>   
            </el-row>
            <!--角色列表-->
         <el-table :data="roleList"  style="width: 100%"  :row-style="{height:'0'}"  :cell-style="{padding:'3'}"
                :default-sort = "{prop: 'createdTime', order: 'descending'}">
                <!--展开列--->
                <el-table-column  type="expand"> 
                    <template  slot-scope="scope">
                        <el-row  v-for="(item1)  in scope.row.rights" :key="item1.rid"  :class="['vcenter','bdbottom',i1===0 ?'bdtop':'']">
                        <!--渲染一级权限-->    
                                <el-col  :span="3">
                                    <el-tag closable   @close="handleClose(scope.row,item1.rid)" >{{item1.rname}}</el-tag>
                                    <i  class="el-icon-caret-right"></i>
                                </el-col>
                            <!--渲染二三级权限-->
                            <el-col :span="21">
                                <!---二级权限--> 
                                 <el-row   v-for="(item2,i2) in item1.children" :key="item2.rid"
                                 :class="[i2===0 ?'':'bdtop','vcenter']"
                                 >
                                  <el-col  :span="5">
                                      <el-tag closable   @close="handleClose(scope.row,item2.rid)"  type="success">{{item2.rname}}</el-tag>
                                       <i  class="el-icon-caret-right"></i>
                                  </el-col>
                                  <!--三级权限-->   
                                  <el-row  v-for="(item3)  in item2.children" :key="item3.rid">
                                      <el-tag  closable   @close="handleClose(scope.row,item3.rid)" type="warning">{{item3.rname}}</el-tag>             
                                  </el-row>
                                 </el-row>
                                 
                             </el-col>
                        </el-row>    
                    </template>  
               </el-table-column>
                <!--索引列--->
                    <el-table-column  type="index"  label="序号" sortable  width="180"></el-table-column>
                    <el-table-column  prop="roleName"  label="角色名称"></el-table-column>
                    <el-table-column  prop="roleDesc"   label="角色描述"></el-table-column>
                    <el-table-column   label="操作">
                        <template  slot-scope="scope" >
                            <el-row>
                            <el-tooltip class="item" effect="dark"  content="编辑" placement="top-start">
                                <el-button type="primary" icon="el-icon-edit" circle></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="分配权限" placement="top-start">
                                    <el-button type="warning" @click="fenpei(scope.row)" icon="el-icon-share" circle></el-button>
                            </el-tooltip>
                            
                            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                                
                                    <el-button type="danger"    icon="el-icon-delete" circle></el-button>
                                
                            </el-tooltip>
                        
                            </el-row>
                    </template>
                    </el-table-column>
                
        </el-table>
        <!---分配权限用的对话框-->
        <el-dialog
            title="分配权限"
            :visible.sync="fenpeidialogVisible"
            width="30%"
            >
        <!--树形控件--->
            <el-tree
                :data="rightsList"
                show-checkbox
                node-key="rid"
                :default-expanded-keys="defkeys"
                :default-checked-keys="defkeys"  ref="treeRef" default-expand-all
                :props="treeProps">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="quxiao">取 消</el-button>
                <el-button type="primary" @click="subupdate">确 定</el-button>
            </span>
            </el-dialog>




         </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return{
            //所有角色的权限信息数据
            roleList:[],
            //所有权限的数据
            rightsList:[],
            //树形控件的属性的绑定对象
             treeProps:{
             label:'rname',
             children:'children'
            },
            fenpeidialogVisible: false,
            defkeys:[],
            roleid:''
        }
    },
    created(){
   this.getRoleList()
    },
    methods:{
        //给角色实际分配权限
      async  subupdate(){
        this.fenpeidialogVisible=false
        const  keys=[
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        console.log(keys)
        const  keysString=keys.join(',')
        const {data : ss} = await   this.$http.post('right/updateRight/role:/'+this.roleid+'/'+keysString)
        console.log("分配")
        console.log(ss)
        },
            quxiao(){
                this.fenpeidialogVisible=false
            this.defkeys=[]
            
            },
        //获取所有角色的权限信息
        async  getRoleList(){
           
            const {data :res} =await  this.$http.get('/right/queryRoles')
            if(res.code==200){
                 this.roleList=res.data;
                 console.log(this.roleList)
            }
        },
       async fenpei(role){
           this.roleid=role.rid
             console.log("role")
           console.log(role)
          this.fenpeidialogVisible=true
          //获取所有权限  树形结构  （跟人无关）
            const  {data:res} =await this.$http.get('right/queryAllRightTree')
            console.log("8888")
            if(res.code==200){
              this.rightsList=res.data
              console.log("rname")
              console.log(this.rightsList)
              //java  可以通过角色id查出所有对应得三级权限得id,赋值给这个数组
              //也可以用前端自己得操作去赋值
              this.getTargetKeys(role,this.defkeys)
            }
        },
            getTargetKeys(node,arr){
                console.log("node")
                if(!node.children&&!node.rights){
                    //这就是三级节点
                    return  arr.push(node.rid)
                }
                else if(!node.children){
                    //这是一级节点
                    node.rights.forEach(item =>
                    this.getTargetKeys(item,arr))
                }else{
                    //这是二级节点
                    node.children.forEach(item =>
                    this.getTargetKeys(item,arr))
                }
            },
        

        //删除权限tag块
        handleClose(roleid,rightid){
            console.log("cccc")
            console.log(roleid.rid)
            console.log('dddd')
             console.log(rightid)
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
          }).then(async()=>{
              const {data:ress}  =await this.$http.get("right/delRight",
              {
                params:{
                    'roleid':roleid.rid,
                    'rightid':rightid
                }
              }
             )
        
              if(ress.code==200){
                  this.getRoleList()
                return  this.$message.success("删除权限成功")
              }else{
                return  this.$message.error("删除权限失败")
              }
          })
        }
    }
}
</script>
<style scoped>
.el-tag{
    margin: 7px;
}

.bdtop{
    border-top:1px  solid  gainsboro;
}
.bdbottom{
    border-top:1px  solid  gainsboro;
}
.vcenter{
    display: flex;
    align-items: center;
}

</style>