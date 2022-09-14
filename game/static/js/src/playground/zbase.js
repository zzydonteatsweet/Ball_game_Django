class AcGamePlayground {
    constructor(root) {
        this.root = root ;
        this.$playground = $(`<div class = "ac_game_playground"></div>`) ;
        this.hide() ;
        
        this.root.$ac_game_1.append(this.$playground) ;
        this.start() ;
    }

    start() {
        let outer = this ;
        $(window).resize(function() {
            outer.resize() ;
        }) ;
    } ;

    get_color() {
        let colors = ['red', 'blue', 'pink', 'grey', 'green'] ;
        return colors[Math.floor(Math.random() * 5) ] ;
    }

    resize() {
        let width = this.$playground.width() ;
        let height = this.$playground.height() ;
        let unit = Math.min(width/16, height/9) ;
        this.width = unit * 16 ;
        this.height = unit * 9 ;
        this.scale = this.height ;

        if(this.gamemap) {
            this.gamemap.resize() ;
        }
    }

    show(mode) {
        this.$playground.show() ;
        
        this.mode = mode ;
        this.width = this.$playground.width() ;
        this.height = this.$playground.height() ;
        this.gamemap = new GameMap(this) ;
        this.resize() ;
        this.players = [] ;
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.15, "me", this.root.Settings.username, 
        this.root.Settings.photo) ) ; // 玩家操控角色
        // this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true) ) ; // 玩家操控角色
        if(mode === "single") {
            for(let i = 0 ; i < 5 ; i ++) {
                this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, this.get_color() , 0.15, "robot"))  ;
                // this.players.push(new Player(this, this.width / 2, this.height * 0.5, this.height * 0.05, this.get_color() , this.height * 0.15, false))  ;
            }
        }else {
            let outer = this ;
            this.mps = new MultiPlayerSocket(this) ;
            this.mps.uuid = this.players[0].uuid ;
            
            this.mps.ws.onopen = function() {
                outer.mps.send_create_player(outer.root.Settings.username, outer.root.Settings.photo) ;
            }
        }
    }

    hide() {
        this.$playground.hide() ;
    }
}