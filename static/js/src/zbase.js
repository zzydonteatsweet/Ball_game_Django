export class ACgame {
    constructor(id, AcWingOS) {
        // console.log("Create ACgame") ;
        if(AcWingOS)
            this.AcWingOS = AcWingOS ;
        this.id = id ;
        this.$ac_game_1 = $('#' + id) ;
        this.menu = new AcGameMenu(this) ;
        this.Settings = new Settings(this) ;
        this.playgroud = new AcGamePlayground(this) ;

        this.start() ;
    }

    start() {
    }
    
}