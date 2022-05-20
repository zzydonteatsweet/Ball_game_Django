export class ACgame {
    constructor(id) {
        // console.log("Create ACgame") ;
        this.id = id ;
        this.$ac_game_1 = $('#' + id) ;
        // this.menu = new AcGameMenu(this) ; 
        this.playgroud = new AcGamePlayground(this) ;
        this.start() ;
    }

    start() {

    }
    
}