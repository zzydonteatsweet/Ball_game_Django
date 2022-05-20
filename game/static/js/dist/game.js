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
    
}let AC_Game_Object = [] ;
export class AcGameObject {
        constructor() {
                AC_Game_Object.push(this) ;

                this.has_called = false ;
                this.time_delta = 0 ;
        }

        start() {

                }

        update() {

                }

        on_destroy() {

                }

        destroy() {
                this.on_destroy() ;
                    
                for(let i = 0 ; i < AC_Game_Object.length ; i ++) {
                        if(AC_Game_Object[i] === this) {
                                AC_Game_Object.splice(i, 1) ;
                                break ;
                        }
                }
        }

        
}

let last_timestamp ;
let AC_ANIMATION = function(timestamp) {
        for(let i = 0 ; i < AC_Game_Object.length ; i ++) {
                let obj = AC_Game_Object[i] ;
            if(!obj.has_called) {
                        obj.has_called = true ;
                        obj.start() ;
                }else {
                        obj.update() ;
                        obj.time_delta = timestamp - last_timestamp ;
                }
        }

        last_timestamp = timestamp ;
        requestAnimationFrame(AC_ANIMATION)        
}

requestAnimationFrame(AC_ANIMATION) 
class GameMap extends AcGameObject {
    constructor(playground) {
        super() ;
        this.playground = playground ;
        this.$canvas = $(`<canvas></canvas>`) ;
        this.ctx = this.$canvas[0].getContext('2d') ;
        this.ctx.canvas.width = this.playground.width ;
        this.ctx.canvas.height = this.playground.height ;
        this.playground.$playground.append(this.$canvas) ;

    }

    start() {

    }

    update() {
        this.render() ;
    }

    render() {
        this.ctx.fillStyle = "rgba(0,0,0,0.2)" ;
        this.ctx.fillRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height) ;
    }
}// import { AcGameObject } from "../ac_game_object/zbase";

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
        this.eps = 1 ;
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
        this.ctx.beginPath() ;
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false) ;
        this.ctx.fillStyle = this.color ;
        this.ctx.fill() ;
    }
}class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super() ;
        this.playground = playground ;
        this.ctx = this.playground.gamemap.ctx ;
        this.x = x ;
        this.y = y ;
        this.radius = radius ;
        console.log("半径", radius) ;
        this.color = color ;
        this.speed = speed ;
        this.is_me = is_me ;
        this.vx = 1 ;
        this.vy = 1 ;
        this.eps = 0.1 ;
        this.road_length = 0 ;
        this.cur_skill = null ;
        this.damage_speed = 0 ;
        this.damage_x = 0 ;
        this.damage_y = 0 ;
        this.friction = 0.8 ;
        this.spent_time = 0 ;
        this.start() ;
    }


    start() {
        if(this.is_me) {
            this.add_action_listener() ;
        }else {
            let tx = Math.random() * this.playground.width ;
            let ty = Math.random() * this.playground.height ;
            this.move_to(tx, ty) ;
        }
    }

    is_attack(angle, damage_speed) {
        for(let i = 1 ; i < 10 + Math.random() * 5 ; i ++) {
            let x = this.x, y = this.y ;
            let speed = this.speed * Math.random() * 10 ;
            let move_length = this.radius * Math.random() * 5 ;
            let color = this.color ;
            let angle = Math.random() * Math.PI * 2 ;
            let vx = Math.cos(angle) , vy = Math.sin(angle) ;
            let radius = this.radius * 0.1 ;
            new Particle(this.playground,x, y, vx, vy, radius, color, speed, move_length ) ;
        }
        if(this.radius < this.playground.height * 0.01) {
            this.destroy() ;
        }
        console.log("harm", damage_speed) ;
        this.damage_x = Math.cos(angle) ;
        this.damage_y = Math.sin(angle) ;
        this.damage_speed = damage_speed * 100;
        console.log("bef" ,this.radius) ;
        this.radius -= damage_speed ;

        console.log("aft", this.radius) ;
        
    }

    update() {
        this.spent_time += this.time_delta / 1000;
        console.log(this.spent_time) ;
        if(!this.is_me && Math.random() < 1 / 180 && this.spent_time > 5) {
            // let x = this.playground.players[0].x ;
            // let y = this.playground.players[0].y ;
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)] ;
            while(player !== this) player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)] ;

            let tx = player.x + player.vx * player.speed * player.time_delta / 1000 * 0.3 ;
            let ty = player.y + player.vy * player.speed * player.time_delta / 1000 * 0.3 ;
            this.shoot_firball(tx, ty) ;

        }
        if(this.damage_speed > this.playground.height * 0.01) {
            this.vx = 0 ;
            this.vy = 0 ;
            this.road_length = 0 ;
            this.x += this.damage_speed * this.damage_x * this.time_delta / 1000;
            this.y += this.damage_speed * this.damage_y * this.time_delta / 1000;
            // this.radius -= this.damage_speed ;
            this.damage_speed *= this.friction ;
        }else {
            if(this.road_length < this.eps) {
                this.road_length = 0 ;
                this.vx = 0 ;
                this.vy = 0 ;
                if(!this.is_me) {
                    let tx = Math.random() * this.playground.width ;
                    let ty = Math.random() * this.playground.height ;
                    this.move_to(tx, ty) ;
                }
            
            }else {
                let moved = Math.min(this.road_length, this.speed * this.time_delta / 1000) ;
                this.x += this.vx * moved ;
                this.y += this.vy * moved ;
                this.road_length -= moved ;
            }
        }

        if(this.radius < this.height * 0.01 ) {
            this.destroy() ;
            return false ;
        }
        this.render() ;
    }

    add_action_listener() {
        let outer = this ;
        this.playground.gamemap.$canvas.on("contextmenu", function() {
            return false ;
        }) ;
        this.playground.gamemap.$canvas.mousedown(function(e) {
            if(e.which === 3)
                outer.move_to(e.clientX, e.clientY) ;
            else if(e.which === 1) {
                if(outer.cur_skill === "fireball") {
                    outer.shoot_firball(e.clientX, e.clientY) ;
                    
                }

                outer.cur_skill = null ;  
            }
        }) ;

        $(window).keydown(function(e) {
            if(e.which == "81") { //  发射火球
                outer.cur_skill = "fireball" ;                
            }
        })
    }

    shoot_firball(tx, ty) {
        // console.log("shoot at",tx, ty) ;
        let x = this.x ;
        let y = this.y 
        let radius = this.playground.height * 0.01 ;
        let angle = Math.atan2(ty - this.y, tx - this.x) ;
        let vx = Math.cos(angle), vy = Math.sin(angle) ;
        let color = "orange" ;
        let speed = this.playground.height * 0.5 ;
        let move_length = this.playground.height * 1 ;
        // console.log("height", this.playground.height) ;
        // console.log("height * 0.01", this.playground.height * 0.01) ;
        new FireBall(this.playground, x, y, radius, vx, vy, speed, move_length, color, this, this.playground.height * 0.01) ;
    }
    move_to(x, y) {
        this.road_length = this.get_dist(this.x, this.y, x, y) ;
        let angle = Math.atan2(y - this.y, x - this.x) ;
        this.vx = Math.cos(angle) ;
        this.vy = Math.sin(angle) ;
    }

    on_destroy() {
        for(let i = 0 ; i < this.playground.players.length ; i ++) {
            if(this.playground.players[i] === this) {
                this.playground.players.splice(i, 1) ;
            }
        }
    }
    get_dist(a, b, c, d) {
        return Math.sqrt((c - a) * (c - a) + (d - b) * (d - b) ) ;
    }
    render() {
        this.ctx.beginPath() ;
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false) ;
        this.ctx.fillStyle = this.color ;
        this.ctx.fill() ;
    }
}// import { AcGameObject } from "../ac_game_object/zbase";

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
}class AcGamePlayground {
    constructor(root) {
        this.root = root ;
        this.$playground = $(`<div class = "ac_game_playground"></div>`) ;
        
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

    get_color() {
        let colors = ['red', 'blue', 'pink', 'grey', 'green'] ;
        return colors[Math.floor(Math.random() * 5) ] ;
    }
    show() {
        this.$playground.show() ;
    }

    hide() {
        this.$playground.hide() ;
    }
}export class ACgame {
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