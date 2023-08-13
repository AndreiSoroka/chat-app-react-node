import semver from 'semver';
import packageJson from '../../../../package.json' assert {type: 'json'};

/**
 * Check if the current node version satisfies the required version in package.json
 */
export default function checkNodeVersion() {
  if (!semver.satisfies(process.version, packageJson.engines.node)) {
    console.error(
      `Required node version ${packageJson.engines.node} not satisfied with current version ${process.version}.`,
    );
    process.exit(1);
  }
}
