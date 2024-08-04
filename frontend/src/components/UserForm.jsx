import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    contacto_de_confianza: "",
    clave: "",
    edad: "",
    peso: "",
    genero: "",
    estatura: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        window.location.href = "/login";
      } else {
        console.error("Error al registrar usuario");
      }
    } catch (error) {
      console.error("Error en el envío del formulario:", error);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-15 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-800">
          Registro
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-10 shadow-md rounded-md"
        >
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="contacto_de_confianza"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Contacto de confianza (número)
            </label>
            <input
              type="tel"
              id="contacto_de_confianza"
              name="contacto_de_confianza"
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              value={formData.contacto_de_confianza}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="clave"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Clave
            </label>
            <input
              type="password"
              id="clave"
              name="clave"
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              value={formData.clave}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="edad"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Edad
              </label>
              <input
                type="number"
                id="edad"
                name="edad"
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                value={formData.edad}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="peso"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Peso (kg)
              </label>
              <input
                type="number"
                id="peso"
                name="peso"
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                value={formData.peso}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="genero"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Género
            </label>
            <select
              id="genero"
              name="genero"
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              value={formData.genero}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione su género</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="estatura"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Estatura (cm)
            </label>
            <input
              type="number"
              id="estatura"
              name="estatura"
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              value={formData.estatura}
              onChange={handleChange}
              required
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full flex justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Login() {
  const [formData, setFormData] = useState({
    nombre: "",
    clave: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Datos de inicio de sesión:", data);
        if (data.success) {
          login(data.userId);
          console.log("ID del usuario autenticado:", data.userId);
          navigate(`/user_profile/${data.userId}`);
        } else {
          console.error("Error al ingresar:", data.message);
        }
      } else {
        const errorData = await response.json();
        console.error("Error de inicio de sesión:", errorData.message);
      }
    } catch (error) {
      console.error("Error en el envío del formulario:", error);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-15 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-800">
          Ingreso
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-10 shadow-md rounded-md"
        >
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="clave"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Clave
            </label>
            <input
              type="password"
              id="clave"
              name="clave"
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              value={formData.clave}
              onChange={handleChange}
              required
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full flex justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EditUser() {
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    username: "",
    clave: "",
    num_emergencia: "",
    edad: "",
    peso: "",
    altura: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user_profile/${userId}`,
          { withCredentials: true }
        );
        setFormData(response.data);
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);

    try {
      const response = await axios.post(
        `http://localhost:3000/update_user/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        navigate(`/user_profile/${userId}`);
      } else {
        console.error("Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error en el envío del formulario:", error);
    }
  };

  return (
    <div className="flex items-center justify-center py-14 bg-gray-400">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Editar perfil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-3">
            <label htmlFor="username" className="form-label block mb-2">
              Nombre
            </label>
            <input
              type="text"
              className="form-control w-full p-2 border rounded"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="clave" className="form-label block mb-2">
              Clave
            </label>
            <input
              type="password"
              className="form-control w-full p-2 border rounded"
              id="clave"
              name="clave"
              value={formData.clave}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="num_emergencia" className="form-label block mb-2">
              Contacto de confianza (número)
            </label>
            <input
              type="tel"
              className="form-control w-full p-2 border rounded"
              id="num_emergencia"
              name="num_emergencia"
              value={formData.num_emergencia}
              onChange={handleChange}
              required
            />
          </div>
          <div className="row flex space-x-4">
            <div className="col-md-6 mb-3 w-1/2">
              <label htmlFor="edad" className="form-label block mb-2">
                Edad
              </label>
              <input
                type="number"
                className="form-control w-full p-2 border rounded"
                id="edad"
                name="edad"
                value={formData.edad}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3 w-1/2">
              <label htmlFor="peso" className="form-label block mb-2">
                Peso (kg)
              </label>
              <input
                type="number"
                className="form-control w-full p-2 border rounded"
                id="peso"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="altura" className="form-label block mb-2">
              Estatura (cm)
            </label>
            <input
              type="number"
              className="form-control w-full p-2 border rounded"
              id="altura"
              name="altura"
              value={formData.altura}
              onChange={handleChange}
              required
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-gray-800 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Actualizar perfil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
