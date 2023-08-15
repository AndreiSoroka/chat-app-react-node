import getEnvironments from "../../env/getEnvironments.mjs";

const { PORT } = getEnvironments();

/**
 * Check if PORT is defined in env.
 */
export default function checkPort() {
  if (!PORT) {
    console.error(new Error("env PORT is required"));
    process.exit(1);
  }

  // eslint-disable-next-line no-restricted-globals
  if (!isFinite(PORT)) {
    console.error(new Error(`env PORT=${PORT} must be a number`));
    process.exit(1);
  }

  if (PORT < 1 || PORT > 65535) {
    console.error(new Error(`env PORT=${PORT} must be in the range 1-65535`));
    process.exit(1);
  }

  if (parseInt(PORT, 10).toString() !== PORT) {
    console.error(new Error(`env PORT=${PORT} should not have leading zeros`));
    process.exit(1);
  }
}
