window.PhaserGlobal = {
  disableWebAudio: true
};

var juego = new Phaser.Game(290, 540, Phaser.CANVAS, 'runner');

//Agregando los estados del juego
juego.state.add('Juego', Juego);
juego.state.add('Terminado', Terminado);

//Inicializamos juego en el estado Juego
juego.state.start('Juego');