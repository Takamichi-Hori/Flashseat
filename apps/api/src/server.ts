import { app } from "./app.js";
import { env } from "./config.js";

const port = env.PORT;

app.listen(
    port,
    "0.0.0.0",
    () => {
        console.log(`FlashSeat API listening on ${port}`);
    }
);
