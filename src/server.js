import Hapi from "@hapi/hapi";
// eslint-disable-next-line import/no-extraneous-dependencies
import Yar from "@hapi/yar";
// eslint-disable-next-line import/no-extraneous-dependencies
import Vision from "@hapi/vision";
// eslint-disable-next-line import/no-extraneous-dependencies
import Inert from "@hapi/inert";
// eslint-disable-next-line import/no-extraneous-dependencies
import Joi from "joi";
// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from "dotenv";
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
    port: process.env.PORT || 3000,
  });
  const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  // process.exit(1);
}
  await server.register(Inert);
  await server.register(Vision);
  await server.register(Cookie);
  server.validator(Joi);
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
  db.init("mongo");
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

Handlebars.registerHelper("log", function(content) {
  console.log(content.fn(this));
  return "";
});

init();