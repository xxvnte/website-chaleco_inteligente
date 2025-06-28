import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import config from "../../config.json";

export function UserCard() {
  const { userId } = useAuth();
  const { userId: paramUserId } = useParams();
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        if (parseInt(paramUserId, 10) === parseInt(userId, 10)) {
          const response = await fetch(
            `${config.api.url}/edit_user/${paramUserId}`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Datos del usuario:", data);
          setUser(data);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error.message);

        if (error.message.includes("401") || error.message.includes("403")) {
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [userId, paramUserId, navigate]);

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`${config.api.url}/delete_user/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        navigate("/login");
      } else {
        console.error("Error al eliminar el usuario:", response.statusText);
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="bg-white max-w-2xl shadow overflow-hidden rounded-lg mx-auto">
      <div className="px-4 py-4 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Perfil del Usuario
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Detalles e información sobre el usuario.
        </p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Nombre</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {user.username}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Edad</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {user.edad}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Peso</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {user.peso}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Estatura</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {user.altura}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Género</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {user.sexo}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Contacto de Confianza
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {user.num_emergencia}
            </dd>
          </div>
        </dl>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <button
          className="mr-4 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() =>
            navigate(`/edit_user/${userId}`, { withCredentials: true })
          }
        >
          Editar Perfil
        </button>
        <button
          className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={handleOpenModal}
        >
          Eliminar Usuario
        </button>
      </div>

      {showModal && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <div
              className="fixed inset-0 bg-black opacity-30"
              aria-hidden="true"
            ></div>
            <div className="inline-block overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl max-w-sm w-full">
              <div className="bg-white px-4 py-5 sm:p-6">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Confirmar Eliminación
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción
                    no se puede deshacer.
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={handleDeleteUser}
                >
                  Eliminar
                </button>
                <button
                  type="button"
                  className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
