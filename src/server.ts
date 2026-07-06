import app from "./app";
import {env} from "./config/env";

// Starts the Express server on the configured port.
app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
})
