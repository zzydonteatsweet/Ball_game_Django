class MultiPlayerSocket {
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
            }else if(kevent === "message") {
                outer.receive_message(uuid, data.text) ;
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

    send_message(text) {
        let outer = this ;
        this.ws.send(JSON.stringify({
            'event': "message",
            "uuid": outer.uuid,
            "text": text,
        })) ;
    }

    receive_message(uuid, text) {
        let player = this.get_player(uuid) ;
        if(player) {
            player.playground.chatfield.add_message(player.username, text) ;
        }
    }
}