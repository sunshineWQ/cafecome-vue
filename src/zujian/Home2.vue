<template>
    <el-container>
        <el-header>
            <div>
                <img src="../assets/img/logo.png" width="60px" height="60px">
                <span>coffee home控制台</span>
            </div>
            <el-button type="info" @click="logout">退出登录</el-button>
        </el-header>
        <el-container>
            <!--菜单栏-->
            <el-aside :width="isCollapse ? '60px' :'180px'">
                <div   class="toggle-button"  @click="toggleCollapse">X</div>
                <el-menu
                        class="el-menu-vertical-demo"
                        background-color="#333333"
                        text-color="#fff"
                        width="10px"
                        active-text-color="#ffd04b" unique-opened :collapse="isCollapse"
                        :collapse-transition="false"  router>
                        <!--一级菜单-->
                    <el-submenu :index="'/'+item.path" v-for="item in menuList" :key="item.menu_id" >
                        <!--一级菜单的模板区域-->
                        <template slot="title">
                            <!--一级菜单的图标-->
                            <i :class="item.icon_path"></i>
                            <!---->
                            <span>{{ item.content }}</span>
                        </template>
                        <!--二级菜单区域-->
                        <el-menu-item :index="'/'+sub.path" v-for="sub in item.children" :key="sub.menu_id">
                            <template slot="title">
                                <i :class="sub.icon_path"></i>
                                <span>{{ sub.content }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!--主体区域-->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data(){
            return{
                //菜单栏数据
                menuList:[],
                isCollapse:false
            }
        },
        created() {
            this.getMenuList();
        },
        methods:{
            //退出登录
            logout(){
              window.sessionStorage.clear();
              this.$router.push('/login');
            },
            //获取对应的菜单信息
            async getMenuList(){
                const { data:result }=await this.$http.get('user/queryMenus')
                if (result.code !=200){
                    this.$message.error(result.message)
                }else{
                    this.menuList=result.data
                    console.log(result)
                }
            },
            toggleCollapse(){
                this.isCollapse=!this.isCollapse;
            }
        }
    }
</script>
<style lang="less" scoped>
    .el-container{
        height: 100%;
    }
    .el-header{
       background: #333333;
        display: flex;
        justify-content: space-between;
        color: white;
        font-size: 20px;
        padding-left: 0%;
        align-items: center;
        >div{
            display: flex;
            align-items: center;
            span{
                margin-left: 15px;
            }
        }
    }
    .el-aside{
        background: #333333;
    }
    .el-main{
        background: darkgray;
    }
    .toggle-button{
        
        font-size: 10px;
        line-height: 20px;
        color: white;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
    .el-main{
    background-color:white;
}

</style>


