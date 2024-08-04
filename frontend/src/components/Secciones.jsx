import React from "react";

export function Inicio() {
  return (
    <div className="flex items-center justify-center bg-gray-400 py-16 px-6">
      <div className="text-left">
        <h1 className="text-4xl font-bold text-gray-900">Bienvenido</h1>
        <p className="mt-4 text-lg text-gray-900">
          Descubre cómo el chaleco inteligente mejora tu experiencia con
          tecnología avanzada.
        </p>
        <div className="mt-6">
          <a
            href="/mas"
            className="inline-block rounded-md hover:bg-gray-700 bg-gray-800 px-4 py-2 text-white font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Conoce Más
          </a>
        </div>
      </div>
    </div>
  );
}

export function Sobre_el_proyecto() {
  return (
    <div className="flex flex-col items-center py-12 px-6 bg-gray-300 rounded-t-full">
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Motivación del Proyecto
        </h1>
        <p className="text-lg text-gray-700">
          Nuestro proyecto surge de la necesidad de mejorar la experiencia de
          los ciclistas y hacer que sus salidas en bicicleta sean más seguras.
          Observamos que muchos ciclistas enfrentan dificultades para monitorear
          su salud y medir su progreso durante sus salidas. Por lo tanto, nos
          hemos propuesto desarrollar un chaleco inteligente que les permita
          tener un mejor control de su rendimiento y seguridad mientras están en
          la carretera.
        </p>
      </div>
    </div>
  );
}

export function Mantenimiento() {
  return (
    <div className="flex flex-col items-center py-5 px-6 bg-gray-300 rounded-md">
      <div className="max-w-4xl ">
        <h1 className="text-4xl text-center font-bold text-gray-900 mb-6">
          Instrucciones de Mantenimiento
        </h1>
        <p className="text-lg text-center text-gray-700 mb-6">
          Sigue estas instrucciones para mantener tu chaleco en óptimas
          condiciones.
        </p>
        <ul className="list-none space-y-6">
          <li>
            <h3 className="text-2xl font-semibold text-gray-900">
              Limpieza del Chaleco
            </h3>
            <p className="text-gray-700">
              Después de cada uso, limpia el chaleco con un paño húmedo y
              asegúrate de que esté completamente seco antes de guardarlo.
            </p>
          </li>
          <li>
            <h3 className="text-2xl font-semibold text-gray-900">
              Almacenamiento
            </h3>
            <p className="text-gray-700">
              Guarda el chaleco en un lugar fresco y seco, alejado de la luz
              directa del sol y de fuentes de calor.
            </p>
          </li>
          <li>
            <h3 className="text-2xl font-semibold text-gray-900">
              Problemas Técnicos
            </h3>
            <p className="text-gray-700">
              Si experimentas problemas técnicos, por favor contacta al equipo
              de desarrollo del proyecto a través del correo electrónico{" "}
              <strong>vicente.leiva2@mail.udp.cl</strong>.
            </p>
          </li>
          <li>
            <h3 className="text-2xl font-semibold text-gray-900">
              Reinicio del Chaleco
            </h3>
            <p className="text-gray-700">
              Si el chaleco no responde adecuadamente, apágalo y luego vuelve a
              encenderlo para reiniciar el sistema.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function Mas() {
  return (
    <div className="flex flex-col items-center py-12 px-6 bg-gray-300 rounded-md">
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Características y Beneficios
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Descubre cómo nuestro chaleco inteligente revoluciona la experiencia
          de ciclismo.
        </p>
        <ul className="list-none space-y-6">
          <li>
            <h3 className="text-2xl font-semibold text-gray-900">
              Monitor de Frecuencia Cardiaca y Oxímetro
            </h3>
            <p className="text-gray-700">
              Permite a los ciclistas monitorear su frecuencia cardíaca y
              oxígeno en tiempo real para garantizar un ejercicio seguro y
              eficaz.
            </p>
          </li>
          <li>
            <h3 className="text-2xl font-semibold text-gray-900">
              GPS Integrado
            </h3>
            <p className="text-gray-700">
              Proporciona navegación precisa y seguimiento de la ubicación del
              usuario, lo que permite planificar rutas seguras y eficientes.
            </p>
          </li>
          <li>
            <h3 className="text-2xl font-semibold text-gray-900">
              Botón de Emergencia
            </h3>
            <p className="text-gray-700">
              Permite una comunicación rápida con contactos de emergencia en
              situaciones críticas, proporcionando una capa adicional de
              seguridad para el ciclista.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
