import {render} from "preact";
import {App} from "./app";
import "./ui/global-styles.css";
import {registerSW} from "virtual:pwa-register";

render(<App />, document.getElementById("app")!);

let sw: ServiceWorkerRegistration | null = null;
registerSW({
  onOfflineReady: () => {
    console.log("can be used offline");
  },
  onNeedRefresh: () => {
    console.log("need refresh!?");
    if (sw) sw.update();
  },
  onRegistered: (reg) => {
    sw = reg || null;
  },
});
