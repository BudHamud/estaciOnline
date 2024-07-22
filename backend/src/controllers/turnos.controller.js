import { Preference } from "mercadopago";
import Turno from "../models/turno.model.js";
import { client, payments } from "../utils.js";

// GET
const getTurnos = async (req, res) => {
  try {
    const turnos = await Turno.find({ celular: req.params.tel });
    res
      .status(200)
      .json({ message: "Lista de turnos obtenida correctamente", turnos });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los turnos" });
  }
};

// POST
const crearTurno = async (req, res) => {
  const {
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
  } = req.body;
  try {
    const nuevoTurno = new Turno({
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
    });
    await nuevoTurno.save();

    let estado = 'opened'

    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: "turnos",
            title: "Reserva de Turno",
            quantity: 1,
            unit_price: 7500,
          },
        ],
        back_urls: {
          success: "http://localhost:5173/",
        },
      },
    });

    // const response = await payments.create(preference);
    const paymentUrl = preference.sandbox_init_point;

    if (metodoPago === 'efectivo') {
      estado = 'closed'
    }

    res.status(201).json({
      message: "Turno creado correctamente",
      turno: nuevoTurno,
      paymentUrl,
      estado
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el turno" });
    console.log(error);
  }
};

// PUT
const modificarTurno = async (req, res) => {
  const turnoId = req.params.id;
  const {
    apellido,
    celular,
    dni,
    email,
    fecha,
    horario,
    leccion,
    metodoPago,
    nombre,
  } = req.body;
  try {
    const turnoModificado = await Turno.findByIdAndUpdate(
      turnoId,
      {
        apellido,
        celular,
        dni,
        email,
        fecha,
        horario,
        leccion,
        metodoPago,
        nombre,
      },
      { new: true }
    );
    res.status(200).json({
      message: `Turno ${turnoId} modificado correctamente`,
      turno: turnoModificado,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al modificar el turno" });
  }
};

export { getTurnos, crearTurno, modificarTurno };
