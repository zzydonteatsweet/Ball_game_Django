class AcGamePlayground {
    constructor(root) {
        this.root = root ;
        this.$playground = $(`<div class = "ac_game_playground"></div>`) ;
        
        this.hide() ;
        

    }

    get_color() {
        let colors = ['red', 'blue', 'pink', 'grey', 'green'] ;
        return colors[Math.floor(Math.random() * 5) ] ;
    }
    show() {
        this.$playground.show() ;

        this.root.$ac_game_1.append(this.$playground) ;
        this.width = this.$playground.width() ;
        this.height = this.$playground.height() ;
        this.gamemap = new GameMap(this) ;
        this.players = [] ;
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true) ) ; // 玩家操控角色

        for(let i = 0 ; i < 5 ; i ++) {
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.get_color() , this.height * 0.15, false))  ;
        }
    }

    hide() {
        this.$playground.hide() ;
    }
}