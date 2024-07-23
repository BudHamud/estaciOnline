import { useRef, useState } from "react";
import { MetaFunction } from "@remix-run/node";
import turnosAPI from "../api/turnosAPI";
import Cargador from "../components/Cargador";
import TurnoCard from "../components/TurnoCard";

export const meta: MetaFunction = () => {
  return [
    { title: "Reserva de Turno" },
    {
      name: "description",
      content: "Reserva tu turno para dejar tu coche",
    },
  ];
};

export default function Index() {
  const dniInputRef = useRef(null); // Referencia al input de DNI
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [cargar, setCargar] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [telValue, setTelValue] = useState("");
  const [info, setInfo] = useState([]);

  const handleContinue = async () => {
    const turnoSelect = document.getElementById("turno");
    const selectedOption = turnoSelect.value;

    if (selectedOption === "si") {
      setCargar(true);
      const response = await turnosAPI.getTurnos(telValue.toString());
      setCargar(false);
      setInfo(response.turnos);
    } else {
      window.location.href = "/reservar";
    }
  };

  const handleTurnoChange = () => {
    const turnoSelect = document.getElementById("turno");
    const selectedOption = turnoSelect.value;

    // Habilitar o deshabilitar la casilla de DNI según la selección
    dniInputRef.current.disabled = selectedOption === "no";

    // Cambiar el estilo del input de DNI
    dniInputRef.current.style.backgroundColor =
      selectedOption === "no" ? "#f7f7f7" : "#ffffff";
    dniInputRef.current.style.color =
      selectedOption === "no" ? "#999999" : "#000000";

    const telValue = dniInputRef.current.value;
    setIsButtonEnabled(
      selectedOption === "no" ||
        (selectedOption === "si" && telValue.length >= 8)
    );
  };

  const handleDniChange = (event) => {
    const newValue = event.target.value;
    setTelValue(newValue);

    // Actualizar el estado del botón
    setIsButtonEnabled(newValue.length >= 8);
  };

  return (
    <main className="font-sans p-4">
      <div className={`max-w-md mx-auto bg-${darkMode ? 'gray-900' : 'white'} text-${darkMode ? 'white' : 'black'} rounded-lg shadow-lg p-6`}>
        {/* <button onClick={() => setDarkMode(!darkMode)} className={`bg-${darkMode ? 'gray-900' : 'white'} text-${darkMode ? 'white' : 'black'} p-2`}>Darkmode</button> */}
        <h1 className="text-2xl font-semibold mb-4">Reserva de Turnos</h1>
        <div className="mb-4">
          <label
            htmlFor="turno"
            className="block text-sm font-medium text-gray-700"
          >
            ¿Tienes un turno?
          </label>
          <select
            id="turno"
            name="turno"
            className="border-2 border-black-200 p-2 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={handleTurnoChange}
          >
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="dni"
            className="block text-sm font-medium text-gray-700"
          >
            Celular
          </label>
          <input
            type="number"
            id="celular"
            name="celular"
            ref={dniInputRef}
            value={telValue}
            onChange={handleDniChange}
            className="border-2 border-black-200 p-2 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          className={`${
            isButtonEnabled ? "bg-indigo-500" : "bg-gray-400"
          } text-white py-2 px-4 rounded-md`}
          onClick={handleContinue}
          disabled={!isButtonEnabled}
        >
          Continuar
        </button>

        {cargar && <Cargador mensaje={'Buscando turnos'} />}
        {info.length !== 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-2 p-2">Tus turnos</h2>
            {info.map((turno) => (
              <TurnoCard key={turno._id} turno={ turno } />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
