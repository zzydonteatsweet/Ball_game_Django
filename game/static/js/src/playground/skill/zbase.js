// import { AcGameObject } from "../ac_game_object/zbase";

class FireBall extends AcGameObject {
    constructor(playground, x, y, radius, vx, vy, speed, move_length, color, player, damage ) {
        super() ;
        this.color = color ;
        this.playground = playground ;
        this.x = x ;
        this.y = y ;
        this.radius = radius ;
        this.vx = vx ;
        this.vy = vy ;
        this.speed =speed ;
        this.move_length = move_length ;
        this.ctx = this.playground.gamemap.ctx ;
        this.eps = 0.1 ;
        this.player = player ;
        this.damage = damage ;
    }

    start() {

    }

    update() {
        if(this.move_length < this.eps) {
            this.destroy() ;
            return false ;

        }else {
            let moved = Math.min(this.move_length, this.speed * this.time_delta / 1000) ;
            this.x += this.vx * moved ;
            this.y += this.vy * moved ;
            this.move_length -= moved ;

        }

        for(let i = 0 ; i < this.playground.players.length ; i ++) {
            let player = this.playground.players[i] ;
            if(this.player != player && this.is_collision(player)) {
                this.attack(player) ;
                return false ;
            }
        }

        
        this.render() ;

    }
    get_dist(tx, ty) {
        return Math.sqrt((tx - this.x) * (tx - this.x) + (ty - this.y) * (ty - this.y))  ;
    }

    is_collision(player) {
        let dist = this.get_dist(player.x, player.y) ;
        if(dist < this.radius + player.radius) return true ;
        else return false ;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x) ;
        console.log("damage", this.damage) ;
        player.is_attack(angle, this.damage) ;
        this.destroy() ;

    }
    render() {
        this.ctx.beginPath() ;
        this.ctx.arc(this.x, this.y ,this.radius, Math.PI * 2 , false) ;
        this.ctx.fillStyle = this.color ;
        this.ctx.fill() ;   
    }
}