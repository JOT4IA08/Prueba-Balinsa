// Clase para manejar errores de dependencia circular
class DependenciaCircularError extends Error {
  constructor(message) { //recibe el mensaje de error
    super(message);// llama al constructor de error
    this.name = "DependenciaCircularError"; //nombre del error
  }
}
function planificarProduccion(ordenes) { //funcion que recibe la lista de ordenes
  // Construccion de grafo
  const grafo = {};
  for (const orden of ordenes) { //inicializa el bucle de grafo con las ordenes
    grafo[orden.id] = []; //crea cada orden con una lista vacia
  }

  for (const orden of ordenes) {
    if (orden.dependencia) {
      if (!grafo[orden.dependencia]) {
        grafo[orden.dependencia] = [];
      }
      grafo[orden.dependencia].push(orden.id);
    }
  }
  const visitado = {}; // estados: "visitando" o "visitado"
  const resultado = [];

  function dfs(nodo) { //se implementa una busqueda en profundidad
    if (visitado[nodo] === "visitando") {
      throw new DependenciaCircularError(
        `Dependencia circular detectada en la orden ${nodo}`
      );
    }
    if (visitado[nodo] === "visitado") return;

    visitado[nodo] = "visitando";
    for (const vecino of grafo[nodo]) {
      dfs(vecino);
    }
    visitado[nodo] = "visitado";
    resultado.push(nodo);
  }
  // Lanza DFS en todos los nodos
  for (const nodo in grafo) {
    if (!visitado[nodo]) {
      dfs(nodo);
    }
  }

  // El resultado se invierte
  return resultado.reverse();
}

// Ejemplo
const ordenes = [
  { id: "A", duracion: 30, dependencia: null },
  { id: "B", duracion: 45, dependencia: "A" },
  { id: "C", duracion: 20, dependencia: "A" },
  { id: "D", duracion: 25, dependencia: "B" },
  { id: "E", duracion: 15, dependencia: "C" },
]
//Ejemplo 2
/*const ordenconciclo = [
    { id: "A", duracion: 20, dependencia: "B" },
    { id: "B", duracion: 35, dependencia: "A" },
]*/

try {
  const secuencia = planificarProduccion(ordenes); // llama a la funcion con las ordenes en secuencia
  console.log("Secuencia de producción válida:", secuencia);
} catch (e) {
  console.error("Error:", e.message);
}

// Exportacion de función 
module.exports = { planificarProduccion };
