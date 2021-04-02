import YAML from 'yamljs';
import fs from 'fs';
import _ from 'lodash';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const bulidSwaggerDocs = (): any => {
  const excludeModules = ['.DS_Store'];
  let swaggerDocument = YAML.load(`src/swagger.yaml`);

  const moduleNames = fs.readdirSync(`src/modules`);
  moduleNames.forEach((module) => {
    if (!excludeModules.includes(module)) {
      const aggregates = fs.readdirSync(`src/modules/${module}/aggregates`);
      aggregates.forEach((aggregate) => {
        const yamlFile = `src/modules/${module}/aggregates/${aggregate}/${aggregate}.swagger.yaml`;
        if (fs.existsSync(yamlFile)) {
          const moduleYAML = YAML.load(yamlFile);
          swaggerDocument = _.merge(swaggerDocument, moduleYAML);
        }
      });
    }
  });

  return swaggerDocument;
};
