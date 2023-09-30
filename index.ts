import server from "./server";
import config from "./config/config";

server.listen(config.port, () => {
  console.log(`Server is running on ${config.port}`);
});
