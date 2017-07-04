function Level (){
  this.shots = [];
  this.message = "";
  this.lifeP1 = 3;
  this.lifeP2 = 3;
  this.music = true;
  this.end = false;
  this.cenarios = [];
}

Level.prototype.init = function () {
  var parede1 = new Sprite();
  parede1.x = 330;
  parede1.y = 300;
  parede1.height = 355;
  parede1.width = 40;
  
  this.cenarios.push(parede1);

  var parede2 = new Sprite();
  parede2.x = 150;
  parede2.y = 148;
  parede2.height = 50;
  parede2.width = 200;

  this.cenarios.push(parede2);

  var parede3 = new Sprite();
  parede3.x = 150;
  parede3.y = 300;
  parede3.height = 50;
  parede3.width = 100;

  this.cenarios.push(parede3);

  var parede4 = new Sprite();
  parede4.x = 900;
  parede4.y = 260;
  parede4.height = 300;
  parede4.width = 30;

  this.cenarios.push(parede4);

  var parede5 = new Sprite();
  parede5.x = 600;
  parede5.y = 80;
  parede5.height = 50;
  parede5.width = 300;

  this.cenarios.push(parede5);

  var parede6 = new Sprite();
  parede6.x = 1050;
  parede6.y = 420;
  parede6.height = 60;
  parede6.width = 55;

  this.cenarios.push(parede6);

  var parede7 = new Sprite();
  parede7.x = 650;
  parede7.y = 300;
  parede7.height = 200;
  parede7.width = 75;

  this.cenarios.push(parede7);

};

Level.prototype.mover = function (dt) {

    for (var i = this.shots.length-1;i>=0; i--) {
      this.shots[i].mover(dt);
      if(
        this.shots[i].x >  3000 ||
        this.shots[i].x < -3000 ||
        this.shots[i].y >  3000 ||
        this.shots[i].y < -3000
      ){
        this.shots.splice(i, 1);
      }
    }

};

// Level.prototype.moverAng = function (dt) {
//     for (var i = 0; i < this.inimigos.length; i++) {
//       this.inimigos[i].moverAng(dt);
//     }
//     for (var i = this.shots.length-1; i >= 0; i--) {
//       this.shots[i].moverAng(dt);
//       if(
//         this.shots[i].x >  3000 ||
//         this.shots[i].x < -3000 ||
//         this.shots[i].y >  3000 ||
//         this.shots[i].y < -3000
//       ){
//         this.shots.splice(i, 1);
//       }
//     }
// };

Level.prototype.desenhar = function (ctx) {
    for (var i = 0; i < this.cenarios.length; i++) {
      this.cenarios[i].desenhar(ctx);
    }
};

Level.prototype.desenharImg = function (ctx, imageLib) {
  for (var i = 0; i < this.shots.length; i++) {
    this.shots[i].desenharImg(ctx, imageLib.images[this.shots[i].imgkey]);
  }
};

Level.prototype.colidiuCom = function (alvo, resolveColisao) {
    for (var i = 0; i < this.cenarios.length; i++) {
      if(this.cenarios[i].colidiuCom(alvo)){
        resolveColisao(this.cenarios[i], alvo);
      }
    }
};

// Level.prototype.perseguir = function (alvo, dt) {
//   for (var i = 0; i < this.inimigos.length; i++) {
//     this.inimigos[i].perseguir(alvo,dt);
//   }
// };
// Level.prototype.perseguirAng = function (alvo, dt) {
//   for (var i = 0; i < this.inimigos.length; i++) {
//     this.inimigos[i].perseguirAng(alvo,dt);
//   }
// };

Level.prototype.fire = function (alvo, audiolib, key, vol){
  if(alvo.cooldown>0 || (alvo.vx == 0 && alvo.vy == 0)) return;
  var tiro = new Player();
  if(alvo.vx > 0){
    tiro.x = alvo.x + 20;
    tiro.y = alvo.y;
  } else if (alvo.vy > 0) {
    tiro.x = alvo.x;
    tiro.y = alvo.y + 20;
  } else if (alvo.vx < 0) {
    tiro.x = alvo.x - 20;
    tiro.y = alvo.y;
  } else if (alvo.vy < 0) {
    tiro.x = alvo.x;
    tiro.y = alvo.y  - 20;
  }
  tiro.vx = alvo.vx;
  tiro.vy = alvo.vy;
  tiro.width = 8;
  tiro.height = 16;
  tiro.imgkey = "shot";
  this.shots.push(tiro);
  alvo.cooldown = 1;
  if(audiolib && key) audiolib.play(key,vol);
};

Level.prototype.colidiuComParede = function(player, al, key){
  var colisao = false
  for(var i = this.cenarios.length-1; i>=0; i--){
    if(this.cenarios[i].colidiuCom(player)){
      cenario.color = "green";
      colisao = true;
      if(al&&key) al.play(key);
    }
  }
  return colisao;
}

Level.prototype.colidiuComTiros = function(al, key){
  var that = this;
  for(var i = this.shots.length-1; i>=0; i--){

    this.colidiuCom(this.shots[i],      
        function(cenario){
            cenario.color = "green";
            that.shots.splice(i,1);
            if(al&&key) al.play(key);
        }
      );
  }
};

Level.prototype.colidiuComTudo = function (alvo, al, key, resolveColisao) {
    for (var i = 0; i < this.cenarios.length; i++) {
      if(this.cenarios[i].colidiuCom(alvo)){
        resolveColisao(this.cenarios[i], alvo);
        if(al && key){
          al.play(key);
        }
      }   
    } 
};

Level.prototype.colidiuComP1 = function (alvo, al, key, resolveColisao) {
    for (var i = 0; i < this.shots.length; i++) {
      if(this.shots[i].colidiuCom(alvo)){
        this.shots.splice(i, 1);
        resolveColisao(this.shots[i], alvo);
        if(al && key){
          al.play(key);
        }
      }   
    } 
};

Level.prototype.colidiuComP2 = function (alvo, al, key, resolveColisao) {
    for (var i = 0; i < this.shots.length; i++) {
      if(this.shots[i].colidiuCom(alvo)){
        this.shots.splice(i, 1);
        resolveColisao(this.shots[i], alvo);
        if(al && key){
          al.play(key);
        }
      }   
    } 
};

Level.prototype.colidiuComPlayer1 = function(player, al, key){
  var that = this;
  for(var i = this.shots.length-1; i>=0; i--){

    this.colidiuCom(player,      
        function(inimigo){
            inimigo.color = "black";
            x = that.inimigos.indexOf(inimigo);
            that.inimigos.splice(x, 1);
            that.lifeP1--;
            if(al&&key) al.play(key);
        }
      );
  }
};

Level.prototype.colidiuComPlayer2 = function(player, al, key){
  var that = this;
  for(var i = this.shots.length-1; i>=0; i--){

    this.colidiuCom(player,      
        function(inimigo){
            inimigo.color = "black";
            that.lifeP2--;
            if(al&&key) al.play(key);
        }
      );
  }
};

Level.prototype.playerLife = function(ctx, al = null, key = null){
  if (this.lifeP1 > 0 && this.lifeP2 > 0) {
    return true;
  } else if( this.lifeP1 <= 0) {
    this.message = "Player2 Venceu!";
    ctx.fillText(this.message, 180, 240);
    if(this.music&&al&&key) { 
      al.play(key)
      this.music = false;
    }
    return false;
  } else {
    this.message = "Player1 Venceu!";
    ctx.fillText(this.message, 180, 240);
    if(this.music&&al&&key) { 
      al.play(key)
      this.music = false;
    }
    return false;
  }
};

Level.prototype.victory = function(ctx, al = null, key = null){
    this.inimigos = [];
    this.message = "Você venceu!";
    ctx.fillText(this.message, 180, 240);
    if(this.music&&al&&key) { 
      al.play(key)
      this.music = false;
    }
}

