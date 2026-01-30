import express from "express";
import cors from "cors";
import classTypeRoutes from "./routes/classTypeRoutes";
import classScheduleRoutes from "./routes/classScheduleRouter";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/class-schedules", classScheduleRoutes);
app.use("/api/class-types", classTypeRoutes);

export default app;
