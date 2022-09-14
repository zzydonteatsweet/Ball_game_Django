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
        this.eps = 0.01 ;
        this.player = player ;
        this.damage = damage ;
    }

    start() {

    }

    update() {
        if(this.move_length < this.eps) {
            this.destroy() ;
            return false ;
        }

        this.update_move() ;
        if(this.player.character !== "enemy") {
            this.update_attack() ;
        }
        this.render() ;
    }

    update_move() {
        let moved = Math.min(this.move_length, this.speed * this.time_delta / 1000) ;
        this.x += this.vx * moved ;
        this.y += this.vy * moved ;
        this.move_length -= moved ;

    }

    update_attack() {
        for(let i = 0 ; i < this.playground.players.length ; i ++) {
            let player = this.playground.players[i] ;
            if(this.player != player && this.is_collision(player)) {
                this.attack(player) ;
                return false ;
            }
        }
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
        let outer = this ;
        let angle = Math.atan2(player.y - this.y, player.x - this.x) ;
        // console.log("damage", this.damage) ;
        player.is_attack(angle, this.damage) ;
        if(outer.playground.mode === "multi") {
            console.log("multi_attack", outer.player.uuid, player.uuid) ;
            outer.playground.mps.send_attack(player.uuid, player.x, player.y, angle, this.damage, this.uuid) ;
        }
        this.destroy() ;

    }

    on_destroy() {
        let fireballs = this.player.fireballs ;
        let outer = this ;
        for(let i = 0 ; i < fireballs.length ; i ++) {
            if(fireballs[i] == this) {
                fireballs.splice(i, 1) ;
                break;
            }
        }
    }
    render() {
        let scale = this.playground.scale ;
        this.ctx.beginPath() ;
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, Math.PI * 2 , false) ;
        this.ctx.fillStyle = this.color ;
        this.ctx.fill() ;   
    }
}