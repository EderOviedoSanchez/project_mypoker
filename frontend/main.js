// Lógica para un juego de Blackjack en JavaScript
// Definición de constantes y variables
const VALORES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const PALOS = ['♠', '♥', '♦', '♣'];
const VALOR_CARTA = {
  'A': 11, // El As puede valer 1 u 11
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 10,
  'Q': 10,
  'K': 10
};

class Blackjack {
  constructor() {
    this.mazo = [];
    this.manoJugador = [];
    this.manoCrupier = [];
    this.juegoTerminado = false;
    this.mensaje = '';
    
    this.iniciarJuego();
  }
  
  // Iniciar el juego
  iniciarJuego() {
    this.crearMazo();
    this.barajar();
    this.repartirCartasIniciales();
    this.verificarBlackjackInicial();
  }
  
  // Crear un mazo completo (52 cartas)
  crearMazo() {
    this.mazo = [];
    for (let palo of PALOS) {
      for (let valor of VALORES) {
        this.mazo.push({valor, palo});
      }
    }
  }
  
  // Barajar el mazo (algoritmo de Fisher-Yates)
  barajar() {
    for (let i = this.mazo.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.mazo[i], this.mazo[j]] = [this.mazo[j], this.mazo[i]];
    }
  }
  
  // Repartir 2 cartas al jugador y 2 al crupier
  repartirCartasIniciales() {
    this.manoJugador = [this.sacarCarta(), this.sacarCarta()];
    this.manoCrupier = [this.sacarCarta(), this.sacarCarta()];
  }
  
  // Sacar una carta del mazo
  sacarCarta() {
    return this.mazo.pop();
  }

  // Guardar el resultado de la partida en la base de datos
  async function guardarResultadoPartida (dealerCards, playerCards, result) {
    const datosPartida = {
        // Formateamos las cartas como strings
      dealercards: dealerCards.map(carta => `${carta.valor}${carta.palo}`),
      playercards: playerCards.map(carta => `${carta.valor}${carta.palo}`),
      playerresult: result
    };
  
    try {
      const response = await fetch('/api/mypoker/game/sing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosPartida),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Resultado de la partida guardado:', data);
      } else {
        console.error('Error al guardar el resultado:', response.status);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  }

  // Pedir carta para el jugador
  pedirCarta() {

    if (this.juegoTerminado) return;

    this.manoJugador.push(this.sacarCarta());
  
    if (this.calcularPuntuacion(this.manoJugador) > 21) {
      this.juegoTerminado = true;
      this.mensaje = 'Te has pasado de 21. ¡Has perdido!';
      guardarResultadoPartida( // Llamamos a la función aquí
        this.manoCrupier,
        this.manoJugador,
        this.mensaje
      );
    }
  
    return this.manoJugador;

    // if (this.juegoTerminado) return;
    
    // this.manoJugador.push(this.sacarCarta());
    
    // if (this.calcularPuntuacion(this.manoJugador) > 21) {
    //   this.juegoTerminado = true;
    //   this.mensaje = 'Te has pasado de 21. ¡Has perdido!';
    // }
    
    // return this.manoJugador;
  }
  
  // Plantarse (turno del crupier)
  plantarse() {

    if (this.juegoTerminado) return;

    while (this.calcularPuntuacion(this.manoCrupier) < 17) {
      this.manoCrupier.push(this.sacarCarta());
    }
  
    const puntosJugador = this.calcularPuntuacion(this.manoJugador);
    const puntosCrupier = this.calcularPuntuacion(this.manoCrupier);
  
    if (puntosCrupier > 21) {
      this.mensaje = 'El crupier se ha pasado. ¡Has ganado!';
    } else if (puntosJugador > puntosCrupier) {
      this.mensaje = '¡Has ganado!';
    } else if (puntosJugador < puntosCrupier) {
      this.mensaje = '¡Has perdido!';
    } else {
      this.mensaje = 'Empate';
    }
  
    this.juegoTerminado = true;
    const resultadoPlantarse = {
      manoCrupier: this.manoCrupier,
      resultado: this.mensaje
    };
  
    guardarResultadoPartida( // Llamamos a la función aquí
      this.manoCrupier,
      this.manoJugador,
      this.mensaje
    );
  
    return resultadoPlantarse;

    // if (this.juegoTerminado) return;
    
    // // El crupier pide cartas hasta tener 17 o más
    // while (this.calcularPuntuacion(this.manoCrupier) < 17) {
    //   this.manoCrupier.push(this.sacarCarta());
    // }
    
    // const puntosJugador = this.calcularPuntuacion(this.manoJugador);
    // const puntosCrupier = this.calcularPuntuacion(this.manoCrupier);
    
    // // Determinar el ganador
    // if (puntosCrupier > 21) {
    //   this.mensaje = 'El crupier se ha pasado. ¡Has ganado!';
    // } else if (puntosJugador > puntosCrupier) {
    //   this.mensaje = '¡Has ganado!';
    // } else if (puntosJugador < puntosCrupier) {
    //   this.mensaje = '¡Has perdido!';
    // } else {
    //   this.mensaje = 'Empate';
    // }
    
    // this.juegoTerminado = true;
    // return {
    //   manoCrupier: this.manoCrupier,
    //   resultado: this.mensaje
    // };
  }
  
  // Calcular la puntuación de una mano
  calcularPuntuacion(mano) {
    let puntos = 0;
    let cantidadAses = 0;
    
    // Sumar puntos y contar ases
    for (let carta of mano) {
      puntos += VALOR_CARTA[carta.valor];
      if (carta.valor === 'A') {
        cantidadAses++;
      }
    }
    
    // Restar 10 por cada as que cause que nos pasemos de 21
    while (puntos > 21 && cantidadAses > 0) {
      puntos -= 10; // Convertir un As de 11 a 1
      cantidadAses--;
    }
    
    return puntos;
  }
  
  // Verificar si hay Blackjack en la repartición inicial
  verificarBlackjackInicial() {

    const puntosJugador = this.calcularPuntuacion(this.manoJugador);
    const puntosCrupier = this.calcularPuntuacion(this.manoCrupier);
  
    if (puntosJugador === 21 && puntosCrupier === 21) {
      this.mensaje = 'Ambos tienen Blackjack. Empate.';
      this.juegoTerminado = true;
      guardarResultadoPartida(this.manoCrupier, this.manoJugador, this.mensaje); // Llamamos aquí
    } else if (puntosJugador === 21) {
      this.mensaje = '¡Blackjack! Has ganado.';
      this.juegoTerminado = true;
      guardarResultadoPartida(this.manoCrupier, this.manoJugador, this.mensaje); // Llamamos aquí
    } else if (puntosCrupier === 21) {
      this.mensaje = 'El crupier tiene Blackjack. Has perdido.';
      this.juegoTerminado = true;
      guardarResultadoPartida(this.manoCrupier, this.manoJugador, this.mensaje); // Llamamos aquí
    }

    // const puntosJugador = this.calcularPuntuacion(this.manoJugador);
    // const puntosCrupier = this.calcularPuntuacion(this.manoCrupier);
    
    // if (puntosJugador === 21 && puntosCrupier === 21) {
    //   this.mensaje = 'Ambos tienen Blackjack. Empate.';
    //   this.juegoTerminado = true;
    // } else if (puntosJugador === 21) {
    //   this.mensaje = '¡Blackjack! Has ganado.';
    //   this.juegoTerminado = true;
    // } else if (puntosCrupier === 21) {
    //   this.mensaje = 'El crupier tiene Blackjack. Has perdido.';
    //   this.juegoTerminado = true;
    // }
  }
  
  // Obtener el estado actual del juego
  obtenerEstado() {
    return {
      manoJugador: this.manoJugador,
      manoCrupier: this.juegoTerminado ? this.manoCrupier : [this.manoCrupier[0], {valor: '?', palo: '?'}], // Solo mostrar primera carta del crupier
      puntosJugador: this.calcularPuntuacion(this.manoJugador),
      puntosCrupier: this.juegoTerminado ? this.calcularPuntuacion(this.manoCrupier) : null,
      juegoTerminado: this.juegoTerminado,
      mensaje: this.mensaje
    };
  }
  
  // Reiniciar el juego
  reiniciarJuego() {
    this.mazo = [];
    this.manoJugador = [];
    this.manoCrupier = [];
    this.juegoTerminado = false;
    this.mensaje = '';
    
    this.iniciarJuego();
  }
}

// Ejemplo de uso:
// const juego = new Blackjack();
// console.log(juego.obtenerEstado());  // Ver estado inicial
// juego.pedirCarta();  // Pedir carta
// juego.plantarse();   // Plantarse y ver resultado final
