// import { AcGameObject } from "../ac_game_object/zbase";

class Particle extends AcGameObject {
    constructor(playground, x, y, vx, vy, radius, color, speed, move_length) {
        super() ;
        this.playground = playground ;
        this.ctx = this.playground.gamemap.ctx ;
        this.x = x ;
        this.y = y ;
        this.radius =radius ;
        this.color = color ;
        this.vx = vx ;
        this.vy = vy ;
        this.speed = speed ;
        this.move_length = move_length ;
        this.eps = 0.01 ;
        this.friction = 0.8 ;
    }

    start() {

    }

    update() {

        if(this.move_length < this.eps || this.speed < this.eps) {
            this.destroy() ;
            return false ;
        }
        let moved = Math.min(this.move_length, this.speed * this.time_delta / 1000) ;
        this.x += this.vx * moved ;
        this.y += this.vy * moved ;
        this.move_length -= moved ;
        this.speed *= this.friction ;
        this.render() ;
    }
    render() {
        let scale = this.playground.scale ;
        this.ctx.beginPath() ;
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false) ;
        this.ctx.fillStyle = this.color ;
        this.ctx.fill() ;
    }
}