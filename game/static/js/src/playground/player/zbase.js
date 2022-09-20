class Player extends AcGameObject {
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
}