import { Route, Routes, Navigate } from "react-router-dom";
import { Register, Login, EditUser } from "./components/UserForm";
import Navbar from "./components/Navbar";
import {
  Inicio,
  Sobre_el_proyecto,
  Mantenimiento,
  Mas,
} from "./components/Secciones";
import { UserCard } from "./components/UserCard";
import DatosSensores from "./components/DatosSensores";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="bg-gray-400 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-10">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/Sobre_el_proyecto" element={<Sobre_el_proyecto />} />
          <Route path="/mantenimiento" element={<Mantenimiento />} />
          <Route path="/mas" element={<Mas />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/user_profile/:userId"
            element={isAuthenticated ? <UserCard /> : <Navigate to="/login" />}
          />
          <Route
            path="/datos/:userId"
            element={
              isAuthenticated ? <DatosSensores /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/edit_user/:userId"
            element={
              isAuthenticated ? <EditUser /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </main>
  );
}

export default App;
