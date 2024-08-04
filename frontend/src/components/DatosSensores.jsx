import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

const DatosSensores = () => {
  const { userId } = useAuth();
  const { userId: paramUserId } = useParams();
  const [usuarioData, setUsuarioData] = useState({});
  const [saludData, setSaludData] = useState([]);
  const [gpsData, setGpsData] = useState([]);
  const [caloriasPorFecha, setCaloriasPorFecha] = useState({});
  const [gpsStatsPorFecha, setGpsStatsPorFecha] = useState({});
  const [promedios, setPromedios] = useState({ frecuencia: 0, oximetro: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (parseInt(paramUserId, 10) !== parseInt(userId, 10)) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/datos/${paramUserId}`,
          { withCredentials: true }
        );

        setUsuarioData(response.data.user);
        setSaludData(response.data.saludData);
        setGpsData(response.data.gpsData);

        calcularPromedios(response.data.saludData);
        calcularEstadisticasGPS(response.data.gpsData, response.data.user);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [paramUserId, userId, navigate]);

  const calcularPromedios = (saludData) => {
    const sumaFrecuenciaCardiaca = saludData.reduce(
      (acc, curr) => acc + parseFloat(curr.frecuencia_cardiaca || 0),
      0
    );
    const sumaOximetro = saludData.reduce(
      (acc, curr) => acc + parseFloat(curr.oximetro || 0),
      0
    );

    const promedioFrecuenciaCardiaca =
      saludData.length > 0 ? sumaFrecuenciaCardiaca / saludData.length : 0;
    const promedioOximetro =
      saludData.length > 0 ? sumaOximetro / saludData.length : 0;

    setPromedios({
      frecuencia: promedioFrecuenciaCardiaca,
      oximetro: promedioOximetro,
    });
  };

  const calcularEstadisticasGPS = (gpsDataProvided, usuarioData) => {
    const gpsDataPorFecha = {};
    gpsDataProvided.forEach((data) => {
      const fecha = data.fecha.split("T")[0];
      if (!gpsDataPorFecha[fecha]) {
        gpsDataPorFecha[fecha] = [];
      }
      gpsDataPorFecha[fecha].push(data);
    });

    const nuevasCaloriasPorFecha = {};
    const nuevasGpsStatsPorFecha = {};

    Object.keys(gpsDataPorFecha).forEach((fecha) => {
      const gpsData = gpsDataPorFecha[fecha];
      let distanciaTotal = 0;
      let tiempoTotal = 0;
      let ubicacionAnterior = {
        latitud: parseFloat(gpsData[0].latitud),
        longitud: parseFloat(gpsData[0].longitud),
      };

      for (let i = 1; i < gpsData.length; i++) {
        const ubicacionActual = {
          latitud: parseFloat(gpsData[i].latitud),
          longitud: parseFloat(gpsData[i].longitud),
        };
        const tiempoActual = new Date(
          `1970-01-01T${gpsData[i].tiempo}Z`
        ).getTime();
        const tiempoAnterior = new Date(
          `1970-01-01T${gpsData[i - 1].tiempo}Z`
        ).getTime();
        const tiempo = (tiempoActual - tiempoAnterior) / 1000;
        const distancia =
          calcularDistancia(ubicacionAnterior, ubicacionActual) * 1000;
        distanciaTotal += distancia;
        tiempoTotal += tiempo;
        ubicacionAnterior = ubicacionActual;
      }

      const tiempoTotalMinutos = tiempoTotal / 60;
      const velocidadMedia =
        tiempoTotal > 0 ? (distanciaTotal / tiempoTotal) * 3.6 : 0;
      const METs = 1.5 + velocidadMedia * 0.2;

      const pesoUsuario = parseFloat(usuarioData.peso);

      if (!isNaN(pesoUsuario)) {
        const calorias = METs * pesoUsuario * (tiempoTotal / 3600);
        nuevasCaloriasPorFecha[fecha] = !isNaN(calorias) ? calorias : 0;
      } else {
        nuevasCaloriasPorFecha[fecha] = 0;
        console.warn(`Peso del usuario no definido para la fecha: ${fecha}`);
      }

      nuevasGpsStatsPorFecha[fecha] = {
        tiempo: tiempoTotalMinutos,
        distancia: distanciaTotal,
        velocidad: velocidadMedia,
      };
    });

    setCaloriasPorFecha(nuevasCaloriasPorFecha);
    setGpsStatsPorFecha(nuevasGpsStatsPorFecha);
  };

  const calcularDistancia = (punto1, punto2) => {
    const R = 6371; // Radio de la tierra en km
    const dLat = (punto2.latitud - punto1.latitud) * (Math.PI / 180);
    const dLon = (punto2.longitud - punto1.longitud) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(punto1.latitud * (Math.PI / 180)) *
        Math.cos(punto2.latitud * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c;
    return distancia;
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-md max-w-5xl">
      <div className="header text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Chaleco Inteligente
        </h1>
      </div>

      <div className="info">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Datos de Frecuencia Cardíaca y Oxímetro
        </h2>
        <div id="saludData">
          <table className="table-auto w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">Frecuencia Cardíaca</th>
                <th className="p-2 text-left">Oxímetro</th>
                <th className="p-2 text-left">Tiempo</th>
              </tr>
            </thead>
            <tbody>
              {saludData.slice(-4).map((data, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-2">{data.frecuencia_cardiaca}</td>
                  <td className="p-2">{data.oximetro}</td>
                  <td className="p-2">{data.tiempo}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <table className="table-auto w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 text-left"> </th>
                  <th className="p-2 text-left">Promedio Actual</th>
                  <th className="p-2 text-left">Promedio Sano</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Frecuencia Cardíaca</td>
                  <td className="p-2 text-left">
                    {promedios.frecuencia.toFixed(2)}
                  </td>
                  <td className="p-2 text-left">60-100 latidos por minuto</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Oxímetro</td>
                  <td className="p-2 text-left">
                    {promedios.oximetro.toFixed(2)}%
                  </td>
                  <td className="p-2 text-left">95-100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="gps-data mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Estadísticas GPS
          </h2>
          <div>
            <table className="table-auto w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 text-left">Fecha</th>
                  <th className="p-2 text-left">Tiempo (min)</th>
                  <th className="p-2 text-left">Distancia (m)</th>
                  <th className="p-2 text-left">Velocidad (km/h)</th>
                  <th className="p-2 text-left">Calorías quemadas</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(gpsStatsPorFecha).map(([fecha, stats]) => (
                  <tr key={fecha} className="border-b hover:bg-gray-100">
                    <td className="p-2">{fecha}</td>
                    <td className="p-2">{stats.tiempo.toFixed(2)}</td>
                    <td className="p-2">{stats.distancia.toFixed(2)}</td>
                    <td className="p-2">{stats.velocidad.toFixed(2)}</td>
                    <td className="p-2">
                      {caloriasPorFecha[fecha]?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatosSensores;
