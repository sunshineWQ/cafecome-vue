<template>
    <div class="login_container">
        <div class="login_box">
            <!--登录图片-->
            <div class="login_img">
                <!--<img src="../assets/img/login_img.png" alt="login_img">-->
            </div>
            <div class="login_title">
                <p style="color: #3C2918">欢迎使用,</p>
                <p style="color: #3C2918;font-size: 20px"><b>cofe home咖啡管理系统</b></p>
            </div>
            <!---登录表单--->
            <div class="login_form">
                <el-form label-width="75px" :model="admin" :rules="loginFormRules" ref="loginFormRef">
                    <el-form-item label="账号" prop="username">
                        <el-input v-model="admin.phone" placeholder="请输入账号" prefix-icon="el-icon-place"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="admin.password" placeholder="请输入密码" prefix-icon="el-icon-lock"  show-password></el-input>
                    </el-form-item>
                    <el-form-item class="login_button">
                        <el-button type="primary" @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
                <el-divider></el-divider>
                <div class="login_end">
                    <p style="color: #3C2918">已有账号，忘记密码？</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            admin:{
                phone:'',
                password:''
            },
            loginFormRules:{
                phone:[
                    {required:true,message:'请输入手机号',trigger:'blur'},
                    {max:11,min:11,message:'手机号格式错误',trigger:'blur'}
                ],
                password: [
                    {required: true,message:'请输入密码',trigger:'blur'},
                    {min:6,message: '密码不能少于六位',trigger: 'blur'}
                ]
            }
        }
    },
    methods:{
        //点击重置
        restLoginForm(){
            this.$refs.loginFormRef.resetFields();
        },
        //登录
        login(){
            this.$refs.loginFormRef.validate(async valid => {
                if (!valid){
                    //没有符合账号和密码的校验不能提交
                    return ;
                }else {
                    //符合账号和密码的校验可以提交
                    const {data:result} = await this.$http.post("user/login",this.admin);
                    console.log(result)
                    if (result.code==201){
                        this.$message.success("登录成功");
                         window.sessionStorage.setItem("token",result.data)
                        this.$router.push("/home");
                        return ;
                    }else {
                        this.$message.error("登录失败");
                       
                    }
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
    .login_container{
        height: 100%;
        background: url("../assets/img/login_background.jpg") center center no-repeat;
        background-size: cover;
    }
    .login_box{
        background-color: white;
        color: white;
        width: 50%;
        height: 50%;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .login_img{
        width: 35%;
        height: 80%;
        border-radius: 4px;
        position: absolute;
        left: 10%;
        top: 10%;
        background: url("../assets/img/login_img.png") center center no-repeat;
        background-size: cover;
    }
    .login_form{
        width: 35%;
        height: 80%;
        position: absolute;
        right: 10%;
        top: 35%;
    }
    .login_button{
        display: flex;
        justify-content: center;
    }
    .login_title{
        color: black;
        width: 35%;
        height: 5%;
        position: absolute;
        right: 10%;
        top: 10%;
    }
    .login_end{
        color: black;
        font-size: 15px;
        width: 50%;
        height: 3%;
        position: absolute;
        right: 10%;
        top: 55%;
    }
</style>
