import mongoose from "mongoose";

const { Schema } = mongoose;

const turnoSchema = new Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  celular: { type: String, required: true },
  metodoPago: { type: String, enum: ["efectivo", "online"], required: true },
  leccion: { type: String, enum: ["estacionamiento", "calle"], required: true },
  lugar : { type: String, enum: ["domicilio", "local"], required: true },
  domicilio : { type: String },
  adicional: { type: String },
  fecha: { type: Date, required: true },
  horario: { type: String, required: true },
  pagado: { type: Boolean, default: false, required: true },
});

const turnoModel = mongoose.model("Turno", turnoSchema);

export default turnoModel;
