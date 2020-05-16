<template>
    <div>
    <!--面包屑导航-->
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
    <!--卡片区域-->
         <el-card class="box-card">
             
<el-table :data="RightList"  style="width: 100%"  :row-style="{height:'0'}"  :cell-style="{padding:'3'}"
            :default-sort = "{prop: 'createdTime', order: 'descending'}">
                <el-table-column  type="index"  label="序号" sortable  width="180"></el-table-column>
                <el-table-column  prop="rname"  label="权限名称"></el-table-column>
                <el-table-column  prop="path"   label="权限路径"></el-table-column>
                <el-table-column  prop="rlevel" label="权限等级">
                    <template  slot-scope="scope">
                        <el-tag type="success"  v-if="scope.row.rlevel===1">一级</el-tag>
                        <el-tag type="info" v-if="scope.row.rlevel===2">二级</el-tag>
                        <el-tag type="warning" v-if="scope.row.rlevel===3">三级</el-tag>
                    </template>
               
                </el-table-column>
            
               
            </el-table>




         </el-card>
    </div>
    
</template>

<script>
export default {
    data(){
        return{
         //权限列表的数据
         RightList:[]
        }
       
    },
     created(){
   //加载页面时就要执行的方法
     this.quertRight()
   },
        methods:{
         //去后台查询权限列表
       async  quertRight(){
            const{data:res}=await  this.$http.get('right/queryAllRight')
            if(res.code==200){
                this.RightList=res.data;
                console.log(this.RightList)
            }
         }

        }
}
</script>

<style scoped>

</style>