const fs = require("fs/promises");
const path = require("path");


const PROJECT_ROOT = path.resolve(__dirname, ".."); 

// Define paths relative to the project root
const WIDGETS_DIR = path.join(PROJECT_ROOT, "src", "widgets");
const OUTPUT_FILE_TYPES = path.join(WIDGETS_DIR, "core", "autogen.types.ts");
const OUTPUT_FILE_UI = path.join(WIDGETS_DIR, "core", "autogen.ui.ts");
const OUTPUT_FILE_LOGIC_REGISTRY = path.join(WIDGETS_DIR, "core", "autogen.logic.ts");


async function* getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      if (dirent.name !== 'core') {
        yield* getFiles(res);
      }
    } else {
      yield res;
    }
  }
}

async function generateWidgetRegistry() {
  console.log("🚀 Starting widget generator...");
  console.log(`🔎 Scanning folder: ${WIDGETS_DIR}`);

  try {
    const widgetLogicInfos = [];
    const widgetUIInfos = [];

    const widgetDirs = (await fs.readdir(WIDGETS_DIR, { withFileTypes: true }))
      .filter(dirent => dirent.isDirectory() && dirent.name !== 'core')
      .map(dirent => dirent.name);

    for (const dirName of widgetDirs) {
      const logicPath = path.join(WIDGETS_DIR, dirName, 'widget.ts');
      const uiPath = path.join(WIDGETS_DIR, dirName, 'components.tsx');
      
      let typeName = '';
      let className = '';
      let interfaceName = '';
      let logicImportPath = '';

      try {
        const logicContent = await fs.readFile(logicPath, 'utf8');
        const decoratorMatch = logicContent.match(/@registerWidget\(['"]([\w-]+)['"]\)/);
        const classMatch = logicContent.match(/export class (\w+)/);
        if (decoratorMatch && classMatch) {
          typeName = decoratorMatch[1];
          className = classMatch[1];
          interfaceName = `I${className}`;
          const relativePath = path.relative(path.join(WIDGETS_DIR, "core"), logicPath);
          logicImportPath = `./${relativePath.replace(/\\/g, "/").replace(/\.ts$/, "")}`;
          widgetLogicInfos.push({ typeName, className, interfaceName, importPath: logicImportPath });
          console.log(`✅ Widget logic class found: ${className} (Type: ${typeName})`);
        }
      } catch (e) {
        console.warn(`⚠️ Warning: Could not read or parse ${logicPath}. Skipping logic for widget in ${dirName}.`);
      }

      try {
        const uiContent = await fs.readFile(uiPath, 'utf8');
        const componentMatch = uiContent.match(/export function (\w+Component)/);
        const formMatch = uiContent.match(/export function (\w+Form)/);

        if (componentMatch && formMatch) {
          const componentName = componentMatch[1];
          const formName = formMatch[1];
          const relativePath = path.relative(path.join(WIDGETS_DIR, "core"), uiPath);
          const uiImportPath = `./${relativePath.replace(/\\/g, "/").replace(/\.tsx$/, "")}`;
          
          let typeNameFromDir = dirName.replace(/-widget/g, "");
          typeNameFromDir = typeNameFromDir.charAt(0).toUpperCase() + typeNameFromDir.slice(1);

          widgetUIInfos.push({ typeName: typeNameFromDir, componentName, formName, importPath: uiImportPath });
          console.log(`✅ Widget UI found for: ${typeNameFromDir}`);
        } else {
          console.warn(`⚠️ Warning: Missing exported Component or Form in ${uiPath}. Skipping UI for widget in ${dirName}.`);
        }
      } catch (e) {
        console.warn(`⚠️ Warning: Could not read or parse ${uiPath}. Skipping UI for widget in ${dirName}.`);
      }
    }

    if (widgetLogicInfos.length === 0) {
      console.warn("\n⚠️ No files with @registerWidget decorator found.");
    } else {
      const serverContent = generateServerFile(widgetLogicInfos);
      await fs.writeFile(OUTPUT_FILE_TYPES, serverContent);
      console.log(`\n✅ Types file created: ${OUTPUT_FILE_TYPES}`);

      const logicRegistryContent = generateLogicRegistryFile(widgetLogicInfos);
      await fs.writeFile(OUTPUT_FILE_LOGIC_REGISTRY, logicRegistryContent);
      console.log(`✅ Logic registry file created: ${OUTPUT_FILE_LOGIC_REGISTRY}`);
    }

    if (widgetUIInfos.length === 0) {
      console.warn("\n⚠️ No *.ui.tsx files with exported Component and Form found.");
    } else {
      const uiContent = generateUiFile(widgetUIInfos);
      await fs.writeFile(OUTPUT_FILE_UI, uiContent);
      console.log(`✅ UI file created: ${OUTPUT_FILE_UI}`);
    }

    if (widgetLogicInfos.length > 0 && widgetUIInfos.length > 0) {
      console.log(`\n🎉 Success! Widget registry generation complete.`);
    } else {
      console.log(`\n generation finished with warnings.`);
    }
  } catch (error) {
    console.error(`\n❌ Error: Could not process files.`, error);
    process.exit(1);
  }
}

/**
 * Builds the string content for the generated TypeScript file.
 * (This function remains unchanged)
 */
function generateServerFile(widgets) {
  const interfaceImports = `import { ${widgets.map(w => w.interfaceName).join(", ")} } from '@/types/widgets';`;
  const iWidgetUnion = `export type IWidget = ${widgets.map(w => w.interfaceName).join(" | ")};`;
  const widgetTypeUnion = `export type WidgetType = ${widgets.map(w => `"${w.typeName}"`).join(" | ")};`;
  const widgetTypesArray = `export const widgetTypes = [${widgets.map(w => `"${w.typeName}"`).join(", ")}] as const;`;
  return `// 🤖 AUTOGENERATED FILE (SERVER) - DO NOT EDIT MANUALLY!\n// Contains only types + metadata (no class imports).\n\n${interfaceImports}\n\n${iWidgetUnion}\n${widgetTypeUnion}\n${widgetTypesArray}\n`;
}

function generateUiFile(widgets) {
  const imports = widgets.map(w => `import { ${w.componentName}, ${w.formName} } from '${w.importPath}';`).join("\n");
  const registryEntries = widgets.map(w => `  "${w.typeName}": {\n    component: ${w.componentName},\n    form: ${w.formName},\n  },`).join("\n");
  return `"use client";

// 🤖 AUTOGENERATED FILE (CLIENT) - DO NOT EDIT MANUALLY!
// This file is automatically generated by the 'generate-widget-registry.js' script.
// It contains the UI registry for all widgets.
import { FC } from "react";
import { WidgetType, IWidget } from './autogen.types';
${imports}

type WidgetUIRegistry = Record<WidgetType, {
  component: FC<any>;
  form: FC<any>;
}>;

export const widgetUIRegistry: WidgetUIRegistry = {
${registryEntries}
} as const;
`;
}

function generateLogicRegistryFile(widgets) {
  const imports = widgets.map(w => `import { ${w.className} } from '${w.importPath}';`).join("\n");
  const registryEntries = widgets.map(w => `  "${w.typeName}": new ${w.className}(),`).join("\n");
  return `// 🤖 AUTOGENERATED FILE - DO NOT EDIT MANUALLY!
// This file is automatically generated by the 'generate-widget-registry.js' script.
// It contains the logic registry for all widgets.
import { WidgetType } from './autogen.types';
import { BoraWidget } from './bora-widget';
import { IBaseWidget } from '@/types/widgets';
${imports}

export const widgetLogicRegistry: Record<WidgetType, BoraWidget<IBaseWidget>>  = {
${registryEntries}
};
`;
}

// Run script
generateWidgetRegistry();