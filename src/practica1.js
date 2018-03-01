/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {}; // Objeto MemoryGame (traído de un fichero externo, por ejemplo) o nuevo array

var STATUS = {
  BACK  : {value: 0, name: "Boca abajo",  code: "B"}, 
  UP    : {value: 1, name: "Boca arriba", code: "U"}, 
  FOUND : {value: 2, name: "Encontrado",  code: "F"}
};
/**
 * Constructora de MemoryGame
 */
MemoryGame = function(gs) {
	/*--------------------Atributos---------------------*/
	this.gs = gs;
	this.arrayCartas = new Array(16);
	this.numCartasEncontradas = 0;
	this.textoEstado = 'Memory Game';

	this.cartaVolteada = -1; /*Indica si hay en el tablero una carta volteada sin pareja*/
	this.timer;
	/*--------------------Funciones---------------------*/
	/** 
	 * Inicializa el juego creando las cartas (recuerda que son 2 de cada
	 * tipo de carta), desordenándolas y comenzando el bucle de juego.
	 */
	this.initGame = function() {

		this.arrayCartas = [new MemoryGameCard('8-ball'), new MemoryGameCard('8-ball'),
						new MemoryGameCard('potato'), new MemoryGameCard('potato'),
						new MemoryGameCard('dinosaur'), new MemoryGameCard('dinosaur'),
						new MemoryGameCard('kronos'), new MemoryGameCard('kronos'),
						new MemoryGameCard('rocket'), new MemoryGameCard('rocket'),
						new MemoryGameCard('unicorn'), new MemoryGameCard('unicorn'),
						new MemoryGameCard('guy'), new MemoryGameCard('guy'),
						new MemoryGameCard('zeppelin'), new MemoryGameCard('zeppelin')];

		this.arrayCartas = this.arrayCartas.sort(function() {return Math.random() - 0.5});

		this.loop();

	}
	
	/**
	 * Dibuja el juego, esto es: (1) escribe el mensaje con el estado actual del
	 * juego y (2) pide a cada una de las cartas del tablero que se dibujen.
	 */
	this.draw = function () {

		var i = 0;

		gs.drawMessage(this.textoEstado);

		for(i; i < 16; i++){
			this.arrayCartas[i].draw(this.gs, i);
		}
	}
	
	/**
	 *Es el bucle del juego. En este caso es muy sencillo: llamamos al método
	 *draw cada 16ms (equivalente a unos 60fps). Esto se realizará con la función
	 *setInterval de Javascript.
	*/
	this.loop = function () {
		/*var that = this;
		setInterval(function(){
			that.draw();
		}, 16);*/
		this.timer = setInterval(this.draw.bind(this), 16); //bind() hace que la función coja el this que se le pasa por parámetro para usar en cada llamada a this dentro de su ámbito
	}

	/**
	 * Este método se llama cada vez que el jugador pulsa sobre
	 * alguna de las cartas. Es el responsable de voltear la carta y, si hay dos volteadas, comprobar
	 * si son la misma (en cuyo caso las marcará como encontradas). En caso de no ser
	 * la misma las volverá a poner boca abajo.
	 * @param	{int}	cardId	Lugar que ocupa la carta en el array de cartas
	 */
	this.onClick = function(cardId) {
		if(!this.arrayCartas[cardId].encontrada()) {
			this.arrayCartas[cardId].flip();

			if (this.cartaVolteada != -1) {
				if (this.arrayCartas[cardId].comparTo(this.arrayCartas[this.cartaVolteada])) {
					this.arrayCartas[cardId].found();
					this.arrayCartas[this.cartaVolteada].found();
					this.numCartasEncontradas += 2;
					this.textoEstado = 'Match found!!';

					this.cartaVolteada = -1;
					if(this.numCartasEncontradas == 16){
						this.textoEstado = "You Win!!";
						clearInterval(this.timer);
						this.draw();
					}

				}
				else {
					this.textoEstado = 'Try again';
					var that = this;
					setTimeout(function(){
						that.arrayCartas[cardId].flip();
						that.arrayCartas[that.cartaVolteada].flip();

						that.cartaVolteada = -1;
					},1000);
				}
			}
			else {
				this.cartaVolteada = cardId;
			}
		}
	}

	/*--------------------Funciones auxiliares---------------------*/
};



/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {String} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function(id) {
	/*--------------------Atributos---------------------*/
	/*Id del nombre del sprite que representa la carta*/
	this.nombreCarta = id;
	/*Estado de la carta*/
	this.estadoCarta = STATUS.BACK;
	/*--------------------Funciones---------------------*/
	
	/**
	 * Da la vuelta a la carta, cambiando el estado de la misma.
	 */
	this.flip = function() {
		if(this.estadoCarta == STATUS.BACK) {
			this.estadoCarta = STATUS.UP;
		}
		else if(this.estadoCarta == STATUS.UP) {
			this.estadoCarta = STATUS.BACK;
		}
	}

	/**
	 *  Marca una carta como encontrada, cambiando el estado de la misma.
	 */
	this.found = function() {
		this.estadoCarta = STATUS.FOUND;
	}

	/**
	 * Compara dos cartas, devolviendo true si ambas representa la misma carta.
	 * @param {[type]} Carta con la que se va a comparar.
	 */
	this.comparTo = function(otherCard){
		return this.nombreCarta == otherCard.nombreCarta;
	}

	/**
	* Dibuja la carta en su posición, en caso de estar boca abajo, se dibujará 'back'
	* param	{Graphic Server}	gs	Servidor gráfico de la aplicación
	* param {int}				pos 	Lugar que ocupa la carta en el plano
	*/
	this.draw = function(gs, pos) {
		if(this.estadoCarta == STATUS.BACK) {
			gs.draw('back', pos);
		}
		else {
			gs.draw(this.nombreCarta, pos);
		}
	}

	/*--------------------Funciones auxiliares---------------------*/

	this.encontrada = function(){
		return this.estadoCarta == STATUS.FOUND;
	}
};
