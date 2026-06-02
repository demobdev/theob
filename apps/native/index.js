import { initSentry } from "./src/config/sentry";

initSentry();

import { registerRootComponent } from "expo";
import App from "./App";

registerRootComponent(App);
