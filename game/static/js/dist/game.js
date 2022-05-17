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
                    设置
                </div>
            </div>
        </div> 
        `) ;
    this.root.$ac_game_1.append(this.$menu) ;
    this.$single = this.$menu.find('.Ac_game_menu_field_item_single') ;
    this.$multi = this.$menu.find('.Ac_game_menu_field_item_multi') ;
    this.$setting = this.$menu.find('.Ac_game_menu_field_item_settings') ;

    this.start() ;
    }

    start() {
        this.add_listenling_events() ;
    }

    add_listenling_events() {
        let outer = this ;
        this.$single.click(function(){
            outer.hide() ;
            outer.root.playground.show() ;
        });

        this.$multi.click(function(){
            console.log("multiplay begins") ;
        });

        this.$setting.click(function(){
            console.log("settings begins") ;
        });
    }

        show(){
            this.$menu.show() ;
        }

        hide(){
            this.$menu.hide() ;
        }
    
}class ACgame {
    constructor(id) {
        // console.log("Create ACgame") ;
        this.id = id ;
        this.$ac_game_1 = $('#' + id) ;
        this.menu = new AcGameMenu(this) ; 
        // this.playgroud = new AcGamePlayground(this) ;
        this.start() ;
    }

    start() {

    }
    
}