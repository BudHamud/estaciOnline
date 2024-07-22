import { useEffect, useState } from "react";
import turnosAPI from "../api/turnosAPI";
import { MetaFunction } from "@remix-run/react";
import Cargador from "~/components/Cargador";
import TurnoCard from "~/components/TurnoCard";

export const meta: MetaFunction = () => {
  return [
    { title: "Reserva de Turno" },
    {
      name: "description",
      content: "Reserva tu turno para dejar tu coche",
    },
  ];
};

const Reservar = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [celular, setCelular] = useState("");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [leccion, setLeccion] = useState("estacionamiento");
  const [fecha, setFecha] = useState("");
  const [horario, setHorario] = useState("");
  const [lugar, setLugar] = useState("local");
  const [domicilio, setDomicilio] = useState("");
  const [adicional, setAdicional] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [precio, setPrecio] = useState(0);
  const [cargar, setCargar] = useState(false);
  const [detalles, setDetalles] = useState([]);

  const getHorariosDisponibles = () => {
    const fechaNum = new Date(fecha).getDay();

    if (leccion === "estacionamiento") {
      switch (fechaNum) {
        case 1:
        case 3:
        case 5:
          return ["15:00", "16:00", "17:00"];
        case 2:
        case 4:
          return ["15:00", "16:00", "17:00", "18:00"];
        case 6:
          return ["13:00", "14:00", "15:00", "16:00", "17:00"];
        default:
          return [];
      }
    } else if (leccion === "calle") {
      switch (fechaNum) {
        case 1:
        case 3:
        case 5:
        case 6:
          return [
            "08:00",
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
          ];
        case 2:
        case 4:
          return [
            "08:00",
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00",
          ];
        default:
          return [];
      }
    }
    return [];
  };

  const horariosDisponibles = getHorariosDisponibles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargar(true);

    try {
      const response = await turnosAPI.createTurnos({
        nombre,
        apellido,
        celular,
        metodoPago,
        leccion,
        lugar,
        domicilio,
        adicional,
        fecha,
        horario,
        precio,
      });

      if (metodoPago === "online") {
        window.open(await response.paymentUrl, "_blank");
        setMensaje('Esperando el pago')
        
      }

      if (response.estado !== 'opened') {
        setCargar(false);
        setDetalles(response.turno)
      }
      

    } catch (error) {
      console.error("Error al crear el turno:", error.message);
      // Aquí puedes mostrar un mensaje de error al usuario
    }
  };

  const calcularPrecio = () => {
    let precioBase;

    if (lugar === "domicilio") {
      precioBase = 8500;
    } else if (lugar === "local") {
      precioBase = 7500;
    } else {
      precioBase = 0;
    }

    let precioFinal = precioBase;

    if (adicional === "completo") {
      precioFinal *= 11;
    }

    setPrecio(precioFinal);
  };

  useEffect(() => {
    calcularPrecio();
  }, [lugar, adicional]);

  if (cargar) {
    return (
      <main className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <Cargador mensaje={ mensaje } />
      </main>
    );
  }

  if (detalles.length !== 0) {
    return(
      <main className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2x3 font-semibold mb-3">Turno creado con éxito!</h2>
        <h3 className="text-2x3 font-semibold mb-3">Detalles del turno:</h3>
        <TurnoCard turno={detalles} />
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6" suppressHydrationWarning={true}>
      <h1 className="text-2xl font-semibold mb-4">Reserva de Turno</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="apellido"
            className="block text-sm font-medium text-gray-700"
          >
            Apellido
          </label>
          <input
            type="text"
            id="apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="celular"
            className="block text-sm font-medium text-gray-700"
          >
            Celular
          </label>
          <input
            type="tel"
            id="celular"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="metodoPago"
            className="block text-sm font-medium text-gray-700"
          >
            Método de Pago:
          </label>
          <select
            id="metodoPago"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="efectivo">Efectivo</option>
            <option value="online">Pago Online</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="leccion"
            className="block text-sm font-medium text-gray-700"
          >
            Tipo de Lección:
          </label>
          <select
            id="leccion"
            value={leccion}
            onChange={(e) => setLeccion(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="estacionamiento">Estacionamiento</option>
            <option value="calle">Calle</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="lugar"
            className="block text-sm font-medium text-gray-700"
          >
            Lugar de la Lección:
          </label>
          <select
            id="lugar"
            value={lugar}
            onChange={(e) => setLugar(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="local">En el local</option>
            <option value="domicilio">A domicilio</option>
          </select>
        </div>

        {lugar === "domicilio" && (
          <div>
            <label
              htmlFor="domicilio"
              className="block text-sm font-medium text-gray-700"
            >
              Domicilio:
            </label>
            <input
              type="text"
              id="domicilio"
              value={domicilio}
              onChange={(e) => setDomicilio(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="adicional"
            className="block text-sm font-medium text-gray-700"
          >
            Adicionales:
          </label>
          <select
            id="adicional"
            value={adicional}
            onChange={(e) => setAdicional(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option></option>
            <option value="conseguro">Conseguro de última clase</option>
            <option value="completo">Abono del curso completo</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="fecha"
            className="block text-sm font-medium text-gray-700"
          >
            Fecha
          </label>
          <input
            type="date"
            id="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="horario"
            className="block text-sm font-medium text-gray-700"
          >
            Horario
          </label>
          <select
            id="horario"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Selecciona un horario</option>
            {horariosDisponibles.map((hora) => (
              <option key={hora} value={hora}>
                {hora}
              </option>
            ))}
          </select>
        </div>

        <p>Total: ${precio}</p>

        <button
          type="submit"
          className={`${
            fecha && horario ? "bg-indigo-500" : "bg-gray-400"
          } text-white py-2 px-4 rounded-md`}
          disabled={!fecha || !horario}
        >
          {metodoPago !== "efectivo" ? "Pagar" : "Reservar"}
        </button>
      </form>
    </main>
  );
};

export default Reservar;
