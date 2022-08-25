class AcGamePlayground {
    constructor(root) {
        this.root = root ;
        this.$playground = $(`<div class = "ac_game_playground"></div>`) ;
        console.log("ACgamePlayground got it") ;
        this.hide() ;
        
        this.root.$ac_game_1.append(this.$playground) ;
        this.start() ;
    }

    start() {
        // console.log("start it") ;
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
        // console.log("resize") ;
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

    show() {
        this.$playground.show() ;

        // console.log("Show it") ;
        this.resize() ;
        this.width = this.$playground.width() ;
        this.height = this.$playground.height() ;
        this.gamemap = new GameMap(this) ;
        this.players = [] ;
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.15, true) ) ; // 玩家操控角色
        // this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true) ) ; // 玩家操控角色
        for(let i = 0 ; i < 5 ; i ++) {
            this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, this.get_color() , 0.15, false))  ;
            // this.players.push(new Player(this, this.width / 2, this.height * 0.5, this.height * 0.05, this.get_color() , this.height * 0.15, false))  ;
        }
    }

    hide() {
        this.$playground.hide() ;
    }
}