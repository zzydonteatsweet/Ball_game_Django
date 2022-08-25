class Settings {
    constructor(root) {
        this.root = root ;
        this.platform = "WEB" ;
        if(this.root.AcWingOS) this.platform = "ACAPP" ;    
        this.username = "" ;
        this.photo = "" ;

        this.$Settings = $(`
        <div class = "ac-game-settings">
            <div class = "ac-game-settings-login">
                <div class = "ac-game-settings-title">
                    登录 
                </div>
                <div class = "ac-game-settings-username">
                    <div class = "ac-game-settings-item">
                        <input type="text" placeholder="用户名"> 
                    </div> 
                </div>
                
                <div class = "ac-game-settings-password">
                    <div class = "ac-game-settings-item">
                        <input type = "password" placeholder= "密码">         
                    </div>
                </div>

                <div class = "ac-game-settings-submit">
                    <div class = "ac-game-settings-item">
                        <div class = "ac-game-settings-item">
                            <button>登录</button> 
                        </div>
                    </div> 
                </div>
                <div class = "ac-game-settings-error-messages">
                
                </div>

                <div class = "ac-game-settings-option">
                    注册 
                </div>

                <div class = "ac-game-settings-acwing">
                    <img width = "30" src = "https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png" > 
                    <br>
                    <div>
                        Acwing一键登录  
                    </div> 
                </div>
            </div>

            <div class = "ac-game-settings-register">
                <div class = "ac-game-settings-title">
                    注册 
                </div> 
                <div class = "ac-game-settings-username">
                    <div class = "ac-game-settings-item">
                        <input type = "text", placeholder = "用户名">
                    </div>
                </div>

                <div class = "ac-game-settings-password">
                    <div class = "ac-game-settings-item">
                        <input type = "password", placeholder = "密码">
                    </div> 
                </div>

                <div class = "ac-game-settings-password ac-game-settings-password-second">
                    <div class = "ac-game-settings-item">
                        <input type = "password", placeholder = "确认密码"> 
                    </div>
                </div>

                <div class = "ac-game-settings-submit">
                    <div class = "ac-game-settings-item">
                        <button>注册</button>
                    </div>
                </div>

                <div class = "ac-game-settings-error-messages">
                </div>

                <div class = "ac-game-settings-option">
                    登录 
                </div>

                <br>

                <div class = "ac-game-settings-acwing">
                    <img width = "30" src="https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
                    <br>
                    <div>
                        Acwing一键登录
                    </div>
                </div>
            </div>
        </div> 
        `) ;

        this.$login = this.$Settings.find(".ac-game-settings-login") ;
        this.$login_username = this.$login.find(".ac-game-settings-username input") ;
        this.$login_password = this.$login.find(".ac-game-settings-password input") ;
        this.$login_submit = this.$login.find(".ac-game-settings-submit button") ;
        this.$login_error_message = this.$login.find(".ac-game-settings-error-messages") ;
        this.$login_register = this.$login.find(".ac-game-settings-option");
        this.$login.hide() ;

        this.$register = this.$Settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-messages");
        this.$register_login = this.$register.find(".ac-game-settings-option");
        this.$acwing_login = this.$Settings.find(".ac-game-settings-acwing img") ;
        this.$register.hide() ;

        // this.$Settings.hide() ;
        this.root.$ac_game_1.append(this.$Settings) ;
        this.start() ;
    }


    start() {
        let outer = this ;
        if (outer.platform==='ACAPP') {
            this.acapp_getinfo() ;
        }else {
            this.getinfo() ;
            this.add_listening_events() ;
            outer.$acwing_login.click(function() {
                outer.acwing_login() ;
            }) ;
        }
    }

    acapp_login(appid, redirect_uri, scope, state) {
        let outer = this ;
        // console.log("get into acapp_login") ;
        this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function(resp) {
            // console.log("called from acapp_login") ;
            if(resp.result === "success") {
                outer.username = resp.username ;
                outer.photo = resp.photo ;
                outer.$Settings.hide() ;
                outer.root.$menu.show() ;
            }
        })

    }
    acapp_getinfo() {
        let outer = this ;
        // console.log("acapp_getingo_Got") ;
        $.ajax ({
            url: "https://app1841.acapp.acwing.com.cn/settings/acwing/acapp/apply_code",
            type:"GET",
            success: function(resp) {
                if (resp.result ==='success') {
                    // console.log("apply_code_acapp_Got_it") ;
                    outer.acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state) ;
                }
            }
        }) ;
    }
    acwing_login() {
        // console.log("YES") ;
        $.ajax({
            url:"https://app1841.acapp.acwing.com.cn/settings/acwing/web/apply_code",
            type: "GET",
            success: function(resp) {
                // console.log(resp) ;
                if(resp.result === "success") {
                    window.location.replace(resp.apply_code_url) ;
                }
            }
        })
    }

    add_listening_events() {
        this.add_login_events() ;
        this.add_register_events() ;

        // this.add_register_events() ;
    }

    add_register_events() {
        let outer = this ;
        this.$register_login.click(function() {
            outer.login() ;
        }) ;

        this.$register_submit.click(function() {
            outer.register_on_remote() ;
        })
    }

    add_login_events() {
        let outer = this ;
        this.$login_register.click(function() {
            outer.register() ;
        }) ;

        this.$login_submit.click(function() {
            outer.login_on_remote() ;
        })
    }

    register_on_remote() {
        let username = this.$register_username.val() ;
        let password = this.$register_password.val() ;
        let password_confirm = this.$register_password_confirm.val() ;
        // console.log("register_got_it") ;
        $.ajax({
            url: "https://app1841.acapp.acwing.com.cn/settings/register",
            type: "GET",
            data: {
                'username':username,
                'password':password,
                'password_confirm':password_confirm,
            },
            success: function(resp) {
                if(resp.result == "success") {
                    location.reload() ;
                }else {
                    outer.$register_error_message.html(resp.result) ;
                }
            }
        }) ;
    }

    logout_on_remote() {
        if(this.platform == 'ACAPP') return false ;
        let outer = this ;
        this.$login_error_message.empty() ;

        $.ajax({
            url: "https://app1841.acapp.acwing.com.cn/settings/logout", 
            type: "GET",
            success: function(resp) {
                if(resp.result == "success") {
                    location.reload() ;
                }else {
                    outer.$login_error_message.html(resp.result) ;
                }
            }
            
        })
    }

    login_on_remote() {
        let outer = this ;
        let username = outer.$login_username.val() ;
        let password = outer.$login_password.val() ;
        outer.$login_error_message.empty() ;

        $.ajax({
            url: "https://app1841.acapp.acwing.com.cn/settings/login/",
            type: "GET", 
            data: {
                'username': username,
                'password': password,
            },

            success: function(resp) {
                console.log(resp) ;
                if(resp.result == 'success') {
                    location.reload() ;
                }else {
                    outer.$login_error_message.html(resp.result) ;

                }
            }

        })

    }
    register() {
        let outer = this ;
        outer.$login.hide() ;
        outer.$register.show() ;
    }

    login() {
        let outer = this ;
        outer.$register.hide() ;
        outer.$login.show() ;

    }
    getinfo() {
        let outer = this ;
        
        $.ajax({
            url: "https://app1841.acapp.acwing.com.cn/settings/getinfo", 
            type: "GET", 
            data: {
                platform: outer.platform,
            },
            success: function(resp) {
                // console.log(resp) ;
                // console.log("YES,and_got_it") ;
                if(resp.result == "success") {
                    outer.username = resp.username ;
                    outer.photo = resp.photo ;
                    outer.$Settings.hide() ;
                    outer.root.$menu.show() ;
                }else {
                    outer.login() ;
                }
            }
        }) ;
    }
}