class AcGameMenu {
    constructor(root) {
        this.root = root ;
        this.$menu = $(`
        <div class = "Ac_game_menu">
            <div class = "Ac_game_menu_field">
                <div class = "Ac_game_menu_field_item Ac_game_menu_field_item_single">
                    单人模式
                </div> 
                <br>
                <div class = "Ac_game_menu_field_item Ac_game_menu_field_item_multi">
                    多人模式 
                </div>
                <br>
                <div class = "Ac_game_menu_field_item Ac_game_menu_field_item_settings">
                    退出 
                </div>
            </div>
        </div> 
        `) ;
    this.root.$menu = this.$menu ;
    this.root.$ac_game_1.append(this.$menu) ;
    this.$single = this.$menu.find('.Ac_game_menu_field_item_single') ;
    this.$multi = this.$menu.find('.Ac_game_menu_field_item_multi') ;
    this.$setting = this.$menu.find('.Ac_game_menu_field_item_settings') ;
    
    this.start() ;
    }

    start() {
        this.add_listenling_events() ;
        this.$menu.hide() ;
    }

    add_listenling_events() {
        let outer = this ;
        outer.root.playground = new AcGamePlayground(outer.root);

        this.$single.click(function(){
            outer.hide() ;
            outer.root.playground.show("single") ;
        });

        this.$multi.click(function(){
            outer.hide() ;
            console.log("multiplay begins") ;
            // outer.root.playground.show("multi") ;
            
            outer.root.playground.show("multi") ;
        });

        this.$setting.click(function(){
            // console.log("退出达到") ;
            $.ajax({
                url: "https://app1841.acapp.acwing.com.cn/settings/logout/",
                type: "GET",
                success: function(resp) {
                    if(resp.result == 'success') {
                        outer.root.$menu.hide() ;
                        outer.root.Settings.logout_on_remote() ;
                    }
                }
            })
        });
    }

    show(){
        this.$menu.show() ;
    }

    hide(){
        this.$menu.hide() ;
    }
    
}