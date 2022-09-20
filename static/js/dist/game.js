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
                    退出 
                </div>
            </div>
        </div> 
        `) ;
    this.root.$menu = this.$menu ;
    this.root.$ac_game_1.append(this.$menu) ;
    this.$single = this.$menu.find('.Ac_game_menu_field_item_single') ;
    this.$multi = this.$menu.find('.Ac_game_menu_field_item_multi') ;
    this.$setting = this.$menu.find('.Ac_game_menu_field_item_settings') ;
    
    this.start() ;
    }

    start() {
        this.add_listenling_events() ;
        this.$menu.hide() ;
    }

    add_listenling_events() {
        let outer = this ;
        outer.root.playground = new AcGamePlayground(outer.root);

        this.$single.click(function(){
            outer.hide() ;
            outer.root.playground.show("single") ;
        });

        this.$multi.click(function(){
            outer.hide() ;
            // outer.root.playground.show("multi") ;
            
            outer.root.playground.show("multi") ;
        });

        this.$setting.click(function(){
            // console.log("退出达到") ;
            $.ajax({
                url: "https://app1841.acapp.acwing.com.cn/settings/logout/",
                type: "GET",
                success: function(resp) {
                    if(resp.result == 'success') {
                        outer.root.$menu.hide() ;
                        outer.root.Settings.logout_on_remote() ;
                    }
                }
            })
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
                this.uuid = this.create_uuid() ;
                // console.log(this.uuid) ;
        }

        create_uuid() {
                let res = "" ;
                for(let i = 0 ; i < 10 ; i ++) {
                        let x = parseInt(Math.floor(Math.random() * 10)) ;
                        res += x ;
                }

                return res ;
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

    resize() {
        this.ctx.canvas.width = this.playground.width ;
        this.ctx.canvas.height = this.playground.height ;
        this.ctx.fillStyle = "rgba(0,0,0,0.2)" ;
        this.ctx.fillRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height) ;
    }
    
    update() {
        this.render() ;
    }

    render() {
        this.ctx.fillStyle = "rgba(0,0,0,0.2)" ;
        this.ctx.fillRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height) ;
    }
}class NoticeBoard extends AcGameObject{
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
}class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, character, username, photo) {
        super() ;
        this.playground = playground ;
        this.ctx = this.playground.gamemap.ctx ;
        this.x = x ;
        this.y = y ;
        this.radius = radius ;
        this.color = color ;
        this.speed = speed ;
        this.character = character ;
        this.vx = 1 ;
        this.vy = 1 ;
        this.eps = 0.01 ;
        this.road_length = 0 ;
        this.cur_skill = null ;
        this.damage_speed = 0 ;
        this.damage_x = 0 ;
        this.damage_y = 0 ;
        this.friction = 0.8 ;
        this.spent_time = 0 ;
        this.photo = photo ;
        this.username = username ;
        // console.log("player_created",this.username, this.uuid) ;
        this.fireballs = [] ;
        if(this.character !== "robot") {
            this.img = new Image() ;
            this.img.src = this.photo ;
        }

        if(this.character === "me") {
            this.fireball_time = 3 ;  //  单位是秒
            this.fireball_img = new Image() ;
            this.fireball_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_9340c86053-fireball.png" ;

            this.blink_time = 5 ; //   单位是秒 
            this.blink_img = new Image() ;
            this.blink_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_daccabdc53-blink.png" ;
        }
        // this.start() ;
    }


    start() {
        this.playground.player_count ++ ;
        this.playground.notice_board.write("已就绪:"+ this.playground.player_count + "人") ;

        if(this.playground.player_count >= 3) {
            this.playground.state = "fighting" ;
            this.playground.notice_board.write("fighting") ;
        }

        if(this.character == "me") {
            this.add_action_listener() ;
        }else if(this.character == "robot") {
            let tx = Math.random() * this.playground.width / this.playground.scale ;
            let ty = Math.random() * this.playground.height / this.playground.scale ;
            // let tx = Math.random() * this.playground.width ;
            // let ty = Math.random() * this.playground.height ;
            this.move_to(tx, ty) ;
        }
    }

    destroy_fireball(uuid) {
        for(let i = 0 ; i < this.fireballs.length ; i ++) {
            let fireball = this.fireballs[i] ;
            if(fireball.uuid == uuid) {
                fireball.destroy() ;
                break ;
            }
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
        
        this.radius = Math.max(this.radius - damage_speed, 0) ;
        if(this.radius < this.eps) {
            this.destroy() ;
            return false ;
        }

        this.damage_x = Math.cos(angle) ;
        this.damage_y = Math.sin(angle) ;
        this.damage_speed = damage_speed * 100;
        this.speed *= 0.8 ;
        // console.log("bef" ,this.radius) ;
 
    }

    receive_attack(x, y, angle, damage, ball_uuid, attacker) {
        attacker.destroy_fireball(ball_uuid) ;
        this.x = x, this.y = y ;
        this.is_attack(angle, damage) ;
    }

    update() {
        this.spent_time += this.time_delta / 1000 ;
        this.update_move() ;
        if(this.character === "me" && this.playground.state === "fighting") {
            this.update_coldtime() ;
        }
        this.render() ;
    }

    update_coldtime() {
        this.fireball_time -= this.time_delta / 1000 ;
        this.fireball_time = Math.max(0, this.fireball_time) ;
        // console.log(this.fireball_time) ;

        this.blink_time -= this.time_delta/1000 ;
        this.blink_time = Math.max(0, this.blink_time) ;
    }
    update_move() {
        this.spent_time += this.time_delta / 1000;
        // console.log(this.spent_time) ;
        if(this.character === "robot" && Math.random() < 1 / 180 && this.spent_time > 5) {
            // let x = this.playground.players[0].x ;
            // let y = this.playground.players[0].y ;
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)] ;
            while(player === this) player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)] ;

            let tx = player.x + player.vx * player.speed * player.time_delta / 1000 * 0.3 ;
            let ty = player.y + player.vy * player.speed * player.time_delta / 1000 * 0.3 ;
            this.shoot_fireball(tx, ty) ;

        }
        
        if(this.radius < this.eps) {
            this.destroy() ;
            return false ;
        }
        
        if(this.damage_speed > this.eps) {
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
                if(this.character === "robot") {
                    let tx = Math.random() * this.playground.width / this.playground.scale ;
                    let ty = Math.random() * this.playground.height / this.playground.scale ;
                    // let tx = Math.random() * this.playground.width;
                    // let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty) ;
                }
            
            }else {
                let moved = Math.min(this.road_length, this.speed * this.time_delta / 1000) ;
                this.x += this.vx * moved ;
                this.y += this.vy * moved ;
                this.road_length -= moved ;
            }
        }
    }

    add_action_listener() {
        let outer = this ;
        this.playground.gamemap.$canvas.on("contextmenu", function() {
            return false ;
        }) ;
        this.playground.gamemap.$canvas.mousedown(function(e) {
            if(outer.playground.state !== "fighting") {
                return true ;
            }

            const rec = outer.ctx.canvas.getBoundingClientRect() ;
            if(e.which === 3) {
                let tx = (e.clientX - rec.left) / outer.playground.scale ;
                let ty = (e.clientY - rec.top) / outer.playground.scale ;
                outer.move_to(tx, ty) ;
                // console.log("mode", outer.playground.mode) ;
                if(outer.playground.mode === "multi") {
                    outer.playground.mps.send_move_to(tx, ty) ;
                }
                // outer.move_to(e.clientX - rec.left, e.clientY - rec.top) ;
            }else if(e.which === 1) {
                let tx = (e.clientX - rec.left) / outer.playground.scale ;
                let ty = (e.clientY - rec.top) / outer.playground.scale ;
                if(outer.cur_skill === "fireball") {
                    if(outer.fireball_time > outer.eps) {
                        return false ;
                    }

                    let fireball = outer.shoot_fireball(tx, ty) ;

                    if(outer.playground.mode === "multi") {
                        outer.playground.mps.send_shoot_fireball(tx, ty, fireball.uuid) ;
                    }
                    // outer.shoot_firball(e.clientX - rec.left, e.clientY - rec.top) ;                   
                }else if(outer.cur_skill == "blink") {
                    if(outer.blink_time>outer.eps) {
                        return false;
                    }
                    outer.blink(tx,  ty) ;

                    if(outer.playground.mode == 'multi') {
                        outer.playground.mps.send_blink(tx, ty) ;
                    }
                }

                outer.cur_skill = null ;  
            }
        }) ;

        $(window).keydown(function(e) {
            if(outer.playground.state !== "fighting") {
                return true ;
            }

            if(e.which == "81") { //  发射火球
                if(outer.fireball_time > outer.eps) {
                    return true ;
                }
                outer.cur_skill = "fireball" ;                
                return false ;
            }else if(e.which == "70"){
                if(outer.blink_time > outer.eps) {
                    return true ;
                }

                outer.cur_skill = "blink";
                return false ;
            }
        }) ;
    }

    blink(tx, ty) {
        let x = this.x, y = this.y ;
        let d = this.get_dist(x, y, tx, ty) ;
        d = Math.min(d, 0.8) ;
        let angle = Math.atan2(ty-this.y, tx - this.x) ;
        this.x += Math.cos(angle) * d ;
        this.y  += Math.sin(angle) * d;
        this.blink_time = 5 ;
        this.road_length = 0 ;
    }
    shoot_fireball(tx, ty) {
        let x = this.x ;
        let y = this.y 
        // let radius = this.playground.height * 0.01 ;
        // let radius = 0.1 ;
        let radius = this.radius * 0.3 ;
        let angle = Math.atan2(ty - this.y, tx - this.x) ;
        let vx = Math.cos(angle), vy = Math.sin(angle) ;
        let color = "orange" ;
        let speed = 0.5 ;
        let move_length = 1 ;

        this.fireball_time = 3 ;
        let fireball = new FireBall(this.playground, x, y, radius, vx, vy, speed, move_length, color, this, 0.01) ;
        this.fireballs.push(fireball) ;
        return fireball ;
    }

    move_to(x, y) {
        this.road_length = this.get_dist(this.x, this.y, x, y) ;
        let angle = Math.atan2(y - this.y, x - this.x) ;
        this.vx = Math.cos(angle) ;
        this.vy = Math.sin(angle) ;
    }

    on_destroy() {
        if(this.character === "me") {
            this.playground.state = "over" ;
        }
        for(let i = 0 ; i < this.playground.players.length ; i ++) {
            if(this.playground.players[i] === this) {
                this.playground.players.splice(i, 1) ;
                break ;
            }
        }
    }

    get_dist(a, b, c, d) {
        return Math.sqrt((c - a) * (c - a) + (d - b) * (d - b) ) ;
    }

    render() {
        let scale = this.playground.scale ;
        let outer = this ;
        if(this.character !== "robot") {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            // this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (this.x - this.radius) * scale, (this.y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale); 
            // this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
            this.ctx.restore();
        }else {
            this.ctx.beginPath() ;
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false) ;
            // this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false) ;
            this.ctx.fillStyle = this.color ;
            this.ctx.fill() ;
        }

        if(this.character === "me") {
            this.render_skill_coldtime() ;
        }
    }

    render_skill_coldtime() {
        let scale = this.playground.scale ;
        let x = 1.5, y = 0.9, r = 0.04 ;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 3, false);
        // this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.fireball_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale); 
        // this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        this.ctx.restore();
        if(this.fireball_time > 0) {
            this.ctx.beginPath() ;
            this.ctx.moveTo(x * scale, y * scale) ;
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI/2, Math.PI * 2 * this.fireball_time / 3 - Math.PI/2, false) ;
            this.ctx.lineTo(x * scale, y * scale) ;
            // this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false) ;
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.6)" ;
            this.ctx.fill() ;
        }

        x = 1.62, y = 0.9, r = 0.04 ;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 3, false);
        // this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.blink_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale); 
        // this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        this.ctx.restore();
        if(this.blink_time > 0) {
            this.ctx.beginPath() ;
            this.ctx.moveTo(x * scale, y * scale) ;
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI/2, Math.PI * 2 * this.blink_time / 5 - Math.PI/2, false) ;
            this.ctx.lineTo(x * scale, y * scale) ;
            // this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false) ;
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.6)" ;
            this.ctx.fill() ;
        }
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
}class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground ;
        this.ws = new WebSocket("wss://app1841.acapp.acwing.com.cn/wss/multiplayer/") ;

        this.start() ;
    }

    start() {
        this.receive() ;
    }

    receive() {
        let outer = this ;
        this.ws.onmessage = function(e) {
            let data = JSON.parse(e.data) ;
            let uuid = data.uuid ;
            if(uuid == outer.uuid) return false ;
            let kevent = data.event ;
            console.log(kevent) ;
            if(kevent === "create_player") {
                outer.receive_create_player(uuid, data.username, data.photo) ;
            }else if(kevent === "move_to") {
                outer.receive_move_to(uuid, data.tx, data.ty) ;
            }else if(kevent === "shoot_fireball") {
                outer.receive_shoot_fireball(uuid, data.tx, data.ty, data.ball_uuid) ;
            }else if(kevent === 'attack') {
                outer.receive_attack(uuid, data.attacke_uuid, data.x, data.y, data.angle, data.damage, data.ball_uuid)
            }else if(kevent === "blink") {
                console.log("blink") ;
                outer.receive_blink(data.tx, data.ty, uuid) ;
            }
        }
    }

    receive_create_player(uuid, username, photo) {
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            this.playground.height / 2 /this.playground.scale,
            0.05,
            'white',
            0.15,
            "enemy",
            username,
            photo
        )

        player.uuid = uuid ;
        this.playground.players.push(player) ;

    
    }

    get_player(uuid) {
        let players = this.playground.players ;
        for(let i = 0 ; i < players.length ; i ++) {
            let player = players[i] ;
            if(player.uuid == uuid) {
                return player ;
            }
        }
        return null ;
    }
    send_create_player(username, photo) {
        let outer = this ;
        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': outer.uuid,
            'username': username,
            'photo': photo,
        }))
        // console.log("send_player_yes")
    }

    send_move_to(tx, ty) {
        let outer = this ;
        this.ws.send(JSON.stringify({
            'event': "move_to",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        }))
    } 

    receive_move_to(uuid, tx, ty) {
        let player = this.get_player(uuid) ;
        if(player) {
            player.move_to(tx, ty) ;
        }
    }

    send_shoot_fireball(tx, ty, ball_uuid) {
        let outer = this ;
        this.ws.send(JSON.stringify({
            'event': 'shoot_fireball',
            'uuid': outer.uuid,
            'tx': tx, 
            'ty': ty,
            'ball_uuid': ball_uuid,
        })) ;
    }

    send_blink(tx, ty) {
        let outer = this ;
        this.ws.send(JSON.stringify({
            'event': 'blink',
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        })) ;
    }

    receive_blink(tx, ty, uuid) {
        let player = this.get_player(uuid) ;
        if(player) {
            player.blink(tx, ty) ;
        }
    }
    destory_fireball(uuid) {
        let outer = this ;
        for(let i = 0 ; i < this.fireballs.length ; i ++) {
            let fireball = outer.fireballs[i] ;
            if(fireball.uuid == uuid) {
                fireball.destroy() ;
                break ; 
            }
        }
    }
    receive_shoot_fireball(uuid, tx, ty, ball_uuid) {
        let player = this.get_player(uuid) ;
        if(player) {
            let fireball = player.shoot_fireball(tx, ty) ;
            fireball.uuid = ball_uuid ;
        }
    }

    send_attack(attackee_uuid, x, y, angle, damage, ball_uuid) {
        // console.log("send_attack") ;
        let outer = this ;
        
        this.ws.send(JSON.stringify({
            'event': 'attack',
            'uuid': outer.uuid,
            'attacke_uuid': attackee_uuid,
            'x': x,
            'y': y,
            'angle': angle,
            'ball_uuid': ball_uuid,
            'damage': damage,
        }))
    }

    receive_attack(uuid, attacke_uuid, x, y, angle, damage, ball_uuid) {
        // console.log("receive_attacker_uuid", uuid) ;
        // console.log("receive_attackee_uuid", attacke_uuid) ;
        let attacker = this.get_player(uuid) ;
        let attackee = this.get_player(attacke_uuid) ;
        // console.log("attacker",attacker.uuid, "attackee ",uuid) ;

        if(attacker && attackee) {
            attackee.receive_attack(x, y, angle, damage, ball_uuid, attacker) ;
        }
    }

}class AcGamePlayground {
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

        this.state = "wating" //  从wating 变成fighting
        this.notice_board = new NoticeBoard(this) ;
        this.player_count = 0 ;

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
}class Settings {
    constructor(root) {
        this.root = root ;
        this.platform = "WEB" ;
        if(this.root.AcWingOS) this.platform = "ACAPP" ;    
        this.username = "" ;
        this.photo = "" ;

        this.$Settings = $(`
        <div class = "ac-game-settings">
            <div class = "ac-game-settings-login">
                <div class = "ac-game-settings-title">
                    登录 
                </div>
                <div class = "ac-game-settings-username">
                    <div class = "ac-game-settings-item">
                        <input type="text" placeholder="用户名"> 
                    </div> 
                </div>
                
                <div class = "ac-game-settings-password">
                    <div class = "ac-game-settings-item">
                        <input type = "password" placeholder= "密码">         
                    </div>
                </div>

                <div class = "ac-game-settings-submit">
                    <div class = "ac-game-settings-item">
                        <div class = "ac-game-settings-item">
                            <button>登录</button> 
                        </div>
                    </div> 
                </div>
                <div class = "ac-game-settings-error-messages">
                
                </div>

                <div class = "ac-game-settings-option">
                    注册 
                </div>

                <div class = "ac-game-settings-acwing">
                    <img width = "30" src = "https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png" > 
                    <br>
                    <div>
                        Acwing一键登录  
                    </div> 
                </div>
            </div>

            <div class = "ac-game-settings-register">
                <div class = "ac-game-settings-title">
                    注册 
                </div> 
                <div class = "ac-game-settings-username">
                    <div class = "ac-game-settings-item">
                        <input type = "text", placeholder = "用户名">
                    </div>
                </div>

                <div class = "ac-game-settings-password">
                    <div class = "ac-game-settings-item">
                        <input type = "password", placeholder = "密码">
                    </div> 
                </div>

                <div class = "ac-game-settings-password ac-game-settings-password-second">
                    <div class = "ac-game-settings-item">
                        <input type = "password", placeholder = "确认密码"> 
                    </div>
                </div>

                <div class = "ac-game-settings-submit">
                    <div class = "ac-game-settings-item">
                        <button>注册</button>
                    </div>
                </div>

                <div class = "ac-game-settings-error-messages">
                </div>

                <div class = "ac-game-settings-option">
                    登录 
                </div>

                <br>

                <div class = "ac-game-settings-acwing">
                    <img width = "30" src="https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
                    <br>
                    <div>
                        Acwing一键登录
                    </div>
                </div>
            </div>
        </div> 
        `) ;

        this.$login = this.$Settings.find(".ac-game-settings-login") ;
        this.$login_username = this.$login.find(".ac-game-settings-username input") ;
        this.$login_password = this.$login.find(".ac-game-settings-password input") ;
        this.$login_submit = this.$login.find(".ac-game-settings-submit button") ;
        this.$login_error_message = this.$login.find(".ac-game-settings-error-messages") ;
        this.$login_register = this.$login.find(".ac-game-settings-option");
        this.$login.hide() ;

        this.$register = this.$Settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-messages");
        this.$register_login = this.$register.find(".ac-game-settings-option");
        this.$acwing_login = this.$Settings.find(".ac-game-settings-acwing img") ;
        this.$register.hide() ;

        // this.$Settings.hide() ;
        this.root.$ac_game_1.append(this.$Settings) ;
        this.start() ;
    }


    start() {
        let outer = this ;
        if (outer.platform==='ACAPP') {
            this.acapp_getinfo() ;
        }else {
            this.getinfo() ;
            this.add_listening_events() ;
            outer.$acwing_login.click(function() {
                outer.acwing_login() ;
            }) ;
        }
    }

    acapp_login(appid, redirect_uri, scope, state) {
        let outer = this ;
        // console.log("get into acapp_login") ;
        this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function(resp) {
            // console.log("called from acapp_login") ;
            if(resp.result === "success") {
                outer.username = resp.username ;
                outer.photo = resp.photo ;
                outer.$Settings.hide() ;
                outer.root.$menu.show() ;
            }
        })

    }
    acapp_getinfo() {
        let outer = this ;
        // console.log("acapp_getingo_Got") ;
        $.ajax ({
            url: "https://app1841.acapp.acwing.com.cn/settings/acwing/acapp/apply_code",
            type:"GET",
            success: function(resp) {
                if (resp.result ==='success') {
                    // console.log("apply_code_acapp_Got_it") ;
                    outer.acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state) ;
                }
            }
        }) ;
    }
    acwing_login() {
        // console.log("YES") ;
        $.ajax({
            url:"https://app1841.acapp.acwing.com.cn/settings/acwing/web/apply_code",
            type: "GET",
            success: function(resp) {
                // console.log(resp) ;
                if(resp.result === "success") {
                    window.location.replace(resp.apply_code_url) ;
                }
            }
        })
    }

    add_listening_events() {
        this.add_login_events() ;
        this.add_register_events() ;

        // this.add_register_events() ;
    }

    add_register_events() {
        let outer = this ;
        this.$register_login.click(function() {
            outer.login() ;
        }) ;

        this.$register_submit.click(function() {
            outer.register_on_remote() ;
        })
    }

    add_login_events() {
        let outer = this ;
        this.$login_register.click(function() {
            outer.register() ;
        }) ;

        this.$login_submit.click(function() {
            outer.login_on_remote() ;
        })
    }

    register_on_remote() {
        let username = this.$register_username.val() ;
        let password = this.$register_password.val() ;
        let password_confirm = this.$register_password_confirm.val() ;
        // console.log("register_got_it") ;
        $.ajax({
            url: "https://app1841.acapp.acwing.com.cn/settings/register",
            type: "GET",
            data: {
                'username':username,
                'password':password,
                'password_confirm':password_confirm,
            },
            success: function(resp) {
                if(resp.result == "success") {
                    location.reload() ;
                }else {
                    outer.$register_error_message.html(resp.result) ;
                }
            }
        }) ;
    }

    logout_on_remote() {
        if(this.platform == 'ACAPP') {
            this.root.AcWingOS.api.window.close() ;
        }else {
            let outer = this ;
            this.$login_error_message.empty() ;

            $.ajax({
                url: "https://app1841.acapp.acwing.com.cn/settings/logout", 
                type: "GET",
                success: function(resp) {
                    if(resp.result == "success") {
                        location.reload() ;
                    }else {
                        outer.$login_error_message.html(resp.result) ;
                    }
                }
                
            })
        }
    }

    login_on_remote() {
        let outer = this ;
        let username = outer.$login_username.val() ;
        let password = outer.$login_password.val() ;
        outer.$login_error_message.empty() ;

        $.ajax({
            url: "https://app1841.acapp.acwing.com.cn/settings/login/",
            type: "GET", 
            data: {
                'username': username,
                'password': password,
            },

            success: function(resp) {
                console.log(resp) ;
                if(resp.result == 'success') {
                    location.reload() ;
                }else {
                    outer.$login_error_message.html(resp.result) ;

                }
            }

        })

    }
    register() {
        let outer = this ;
        outer.$login.hide() ;
        outer.$register.show() ;
    }

    login() {
        let outer = this ;
        outer.$register.hide() ;
        outer.$login.show() ;

    }
    getinfo() {
        let outer = this ;
        
        $.ajax({
            url: "https://app1841.acapp.acwing.com.cn/settings/getinfo", 
            type: "GET", 
            data: {
                platform: outer.platform,
            },
            success: function(resp) {
                // console.log(resp) ;
                // console.log("YES,and_got_it") ;
                if(resp.result == "success") {
                    outer.username = resp.username ;
                    outer.photo = resp.photo ;
                    outer.$Settings.hide() ;
                    outer.root.$menu.show() ;
                }else {
                    outer.login() ;
                }
            }
        }) ;
    }
}export class ACgame {
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