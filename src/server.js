import Hapi from "@hapi/hapi";
// eslint-disable-next-line import/no-extraneous-dependencies
import Vision from "@hapi/vision";
// eslint-disable-next-line import/no-extraneous-dependencies
import Handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";
// eslint-disable-next-line import/no-extraneous-dependencies
import Cookie from "@hapi/cookie";
import { webRoutes } from "./web-routes.js";
import { db } from "./models/db.js";
import { accountsController } from "./controllers/accounts-controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function init() {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });
  await server.register(Vision);
  await server.register(Cookie);
  server.auth.strategy("session", "cookie", {
    cookie: {
      name: "playtime",
      password: "secretpasswordnotrevealedtoanyone",
      isSecure: false,
    },
    redirectTo: "/",
    validate: accountsController.validate,
  });
  server.auth.default("session");
  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false,
  });
  db.init();
  server.route(webRoutes);
  await server.start();
  console.log("Server running on %s", server.info.uri);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

Handlebars.registerHelper("eq", function( a, b ){
	// eslint-disable-next-line prefer-rest-params
	const next =  arguments[arguments.length-1];
	return (a === b) ? next.fn(this) : next.inverse(this);
});

init();