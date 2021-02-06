var bg;
var fondo;
var cursores;

/*--- ENTIDADES ---*/
var carro;
var enemigos;
var timer;
var gasolinas;
var timerGasolina;

/*--- Variables de Juego ---*/
var puntos;
var txtPuntos;
var vidas;
var txtVidas;
var nivel = 1;
var txtNivel;
var continuar;

/*--- AUDIO ---*/
var explosion;
var sword;
var accel;
var bgm;

var Juego = {
	preload: function(){
		juego.load.image('bg', 'img/bg1.png');
		juego.load.image('carro', 'img/player.png');
		juego.load.image('carroMalo', 'img/enemyUFO.png');
		juego.load.image('gasolina', 'img/gas.png');
		juego.forceSingleUpdate = true;
		
		
		juego.load.audio('explosion', 'audio/explosion.mp3');
		juego.load.audio('sword', 'audio/sword.mp3');
		juego.load.audio('accel', 'audio/accel.mp3');
		juego.load.audio('bgm', ['audio/bodenstaendig_2000_in_rock_4bit.mp3', 'audio/bodenstaendig_2000_in_rock_4bit.ogg']);
	},
	
	create: function(){
		/*--- BASE ---*/
		bg = juego.add.tileSprite(0,0,290,540,'bg');
		
		cursores = juego.input.keyboard.createCursorKeys();
		juego.physics.startSystem(Phaser.Physics.ARCADE);
		
		/*--- AUDIO ---*/			
		explosion = juego.add.audio('explosion');
		sword = juego.add.audio('sword');
		accel = juego.add.audio('accel');
		bgm = juego.add.audio('bgm');
		bgm.play();
		
		/*--- CARRO ---*/
		carro = juego.add.sprite(juego.width/2,496,'carro');
		carro.anchor.setTo(0.5);
		juego.physics.arcade.enable(carro, true);
		
		/*--- ENEMIGOS ---*/
		enemigos = juego.add.group();
		juego.physics.arcade.enable(enemigos, true);
		enemigos.enableBody = true;
		enemigos.createMultiple(20,'carroMalo');
		enemigos.setAll('anchor.x',0.5);
		enemigos.setAll('anchor.y',0.5);
		enemigos.setAll('checkWorldBounds', true);
		enemigos.setAll('outOfBoundsKill', true);
		timer = juego.time.events.loop(1499/(nivel**3.1),this.crearCarroMalo,this);
		
		/*--- GASOLINAS ---*/
		gasolinas = juego.add.group();
		juego.physics.arcade.enable(gasolinas, true);
		gasolinas.enableBody = true;
		gasolinas.createMultiple(20,'gasolina');
		gasolinas.setAll('anchor.x',0.5);
		gasolinas.setAll('anchor.y',0.5);
		gasolinas.setAll('checkWorldBounds', true);
		gasolinas.setAll('outOfBoundsKill', true);
		timerGasolina = juego.time.events.loop(2003,this.crearGasolina,this);
		
		/*--- DISPLAY NIVEL ---*/
		nivel = 1;
		juego.add.text(180,40,"Nivel: ",{ font:"14px Arial", fill:"#FFF" });
		txtNivel = juego.add.text(230,40,"1",{ font:"14px Arial", fill:"#FFF" });
		
		/*--- DISPLAY PUNTOS ---*/
		puntos = 0;
		juego.add.text(40,20,"Puntos: ",{ font:"14px Arial", fill:"#FFF" });
		txtPuntos = juego.add.text(100,20,"0",{ font:"14px Arial", fill:"#FFF" });
		
		/*--- DISPLAY VIDAS ---*/
		vidas = 3;
		juego.add.text(180,20,"Vidas: ",{ font:"14px Arial", fill:"#FFF" });
		txtVidas = juego.add.text(230,20,"3",{ font:"14px Arial", fill:"#FFF" });
	},
	
	update: function(){
		/*--- MOVIMIENTO FONDO ---*/
		bg.tilePosition.y+=3;
		
		/*--- CONTROL CARRO ---*/
		if(cursores.right.isDown && carro.position.x<245){
			carro.position.x+=5;
			
			if (sonidoReproduciendose == false){
				accel.play();
				sonidoReproduciendose = true;
			}
		} else if(cursores.left.isDown && carro.position.x>45){
			carro.position.x-=5;
			
			if (sonidoReproduciendose == false){
				accel.play();
				sonidoReproduciendose = true;
			}
		} else {
			accel.stop();
			sonidoReproduciendose = false
		}
		
		/*--- COLISIONES ---*/
		juego.physics.arcade.overlap(carro
		,enemigos,this.colisionEnem,null,this);
		
		juego.physics.arcade.overlap(carro
		,gasolinas,this.colisionGas,null,this);
	},
	
	/*--- FUNCIONES PERSONALIZADAS ---*/
	crearCarroMalo: function(){
		var enem = enemigos.getFirstDead();
		var posicion = Math.floor( Math.random()*3 + 1 );
		
		enem.physicsBodyType = Phaser.Physics.ARCADE;
		
		enem.anchor.setTo(0.5);
		enem.reset(posicion*73, 0);
		enem.body.velocity.y = 200+(100*nivel);
	},
	
	crearGasolina: function(){
		var gasolina = gasolinas.getFirstDead();
		var posicion = Math.floor( Math.random()*3 + 1 );
		
		gasolina.physicsBodyType = Phaser.Physics.ARCADE;
		
		gasolina.anchor.setTo(0.5);
		gasolina.reset(posicion*73, 0);
		gasolina.body.velocity.y = 200+(100*nivel);
	},
	
	colisionEnem: function(carro,enemigo){
		enemigo.kill();
		
		vidas--;
		txtVidas.text = vidas;
		
		explosion.play();
		
		if (vidas == 0){
			var continuar = confirm("Fin del juego. Desea jugar de nuevo?");
			
			if (continuar == true){
				juego.state.start('Juego');
			} else {
				juego.paused = true;
			}
		}
	},
	
	colisionGas: function(carro,gasolina){
		gasolina.kill();
		
		puntos++;
		txtPuntos.text = puntos;
		
		sword.play();
		
		if (puntos == 5){
			puntos = 0;
			txtPuntos.text = puntos;
			nivel +=1;
			txtNivel.text = nivel;
			}
		
						
		if (nivel == 4){
			juego.state.start('Terminado');
		}
	}
};