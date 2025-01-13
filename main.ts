import { App, fsRoutes, staticFiles } from "fresh";
import { type State } from "~/utils.ts";

import { handler as ga4 } from "~/plugins/ga4.ts";

export const app = new App<State>();
app.use(staticFiles());

app.use(ga4);

await fsRoutes(app, {
  dir: "./",
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
}
