import express from "express";
import logger from "morgan";
import getEnvironments from "../../env/getEnvironments.mjs";

const { NODE_ENV } = getEnvironments();
let app;

/**
 * Initialize Express App
 * @returns {Express}
 */
export function initExpress() {
  if (app) {
    throw new Error("Express already initialized");
  }

  app = express();

  app.use(
    logger("combined", {
      skip: (req) =>
        NODE_ENV === "production" ? req.originalUrl === "/api/ping" : false,
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  return app;
}

/**
 * Get Express instance
 * @returns {Express}
 */
export function getExpress() {
  if (!app) {
    throw new Error("Express not initialized");
  }

  return app;
}
