class NoticeBoard extends AcGameObject{
    constructor(playground) {
        super() ;
        this.playground = playground ;
        this.ctx = this.playground.gamemap.ctx ;
        this.text = "以就绪0人" ;

        this.start() ;
    }

    start() {
        this.update() ;
    }

    write(text) {
        this.text = text ;
    }
    update() {
        this.render() ;
    }

    render() {
        this.ctx.font = "20px serif";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.text,this.playground.width / 2, 20); 
    }
}
