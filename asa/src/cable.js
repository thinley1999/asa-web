import { createConsumer } from "@rails/actioncable";

const cable = createConsumer(import.meta.env.VITE_WEBSOCKET_URL);

export default cable;
