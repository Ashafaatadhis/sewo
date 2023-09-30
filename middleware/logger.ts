import morgan from "morgan";
import config from "../config/config";

let setting = "";
if (config.env === "production") {
  setting = "combined";
} else if (config.env === "development") {
  setting = "dev";
}

export default morgan(setting);
