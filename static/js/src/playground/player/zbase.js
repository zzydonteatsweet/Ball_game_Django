class Player extends AcGameObject {
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

        if(this.is_me) {
            this.img = new Image() ;
            this.img.src = this.playground.root.Settings.photo ;
            console.log(this.img.src) ;
        }

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
        // console.log("harm", damage_speed) ;
        this.damage_x = Math.cos(angle) ;
        this.damage_y = Math.sin(angle) ;
        this.damage_speed = damage_speed * 100;
        // console.log("bef" ,this.radius) ;
        this.radius -= damage_speed ;

        // console.log("aft", this.radius) ;
        
    }

    update() {
        this.spent_time += this.time_delta / 1000;
        // console.log(this.spent_time) ;
        if(!this.is_me && Math.random() < 1 / 180 && this.spent_time > 5) {
            // let x = this.playground.players[0].x ;
            // let y = this.playground.players[0].y ;
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)] ;
            while(player === this) player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)] ;

            let tx = player.x + player.vx * player.speed * player.time_delta / 1000 * 0.3 ;
            let ty = player.y + player.vy * player.speed * player.time_delta / 1000 * 0.3 ;
            this.shoot_firball(tx, ty) ;

        }
        
        if(this.radius < 10 ) {
            this.destroy() ;
            return false ;
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

        
        this.render() ;
    }

    add_action_listener() {
        let outer = this ;
        this.playground.gamemap.$canvas.on("contextmenu", function() {
            return false ;
        }) ;
        this.playground.gamemap.$canvas.mousedown(function(e) {
            const rec = outer.ctx.canvas.getBoundingClientRect() ;
            if(e.which === 3)
                outer.move_to(e.clientX - rec.left, e.clientY - rec.top) ;
            else if(e.which === 1) {
                if(outer.cur_skill === "fireball") {
                    outer.shoot_firball(e.clientX - rec.left, e.clientY - rec.top) ;
                    
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
        if(this.is_me) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2); 
            this.ctx.restore();
        }else {
            this.ctx.beginPath() ;
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false) ;
            this.ctx.fillStyle = this.color ;
            this.ctx.fill() ;
        }
    }
}