


export default {

        globaltoVideo : function (videoid){
                sessionStorage.setItem("selectVideoId",videoid)
                //带/从根路由开始，不带从当前路由开始
                this.$router.push("/videoFrame")

        }

}
