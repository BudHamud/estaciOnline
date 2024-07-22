import express from "express";
import cors from 'cors'
import connectDB from "./config/dbConfig.js";
import turnosRouter from "./routes/turnos.router.js";
import 'dotenv/config'

const app = express();
connectDB()

app.use(express.json());
// app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors({ credentials: true, origin: true }));

app.use("/turnos", turnosRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
