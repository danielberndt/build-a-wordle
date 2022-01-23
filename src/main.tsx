import {render} from "preact";
import {App} from "./app";
import "./ui/global-styles.css";
import {registerSW} from "virtual:pwa-register";

render(<App />, document.getElementById("app")!);

registerSW({
  onOfflineReady: () => {
    console.log("can be used offline");
  },
});
