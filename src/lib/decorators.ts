/**
 * Decorator-Factory, um eine Widget-Klasse mit einem Typ-String zu markieren.
 * @param type Der eindeutige Typ des Widgets (z.B. "TEXT").
 */
/**
 * Decorator to register a widget type.
 *
 * This decorator is intended to be used on widget classes to mark them with a specific type.
 * The function itself does not modify the class or perform any logic; its sole purpose is to exist
 * in the codebase so that external tools (such as code generators) can detect and process the decorated classes.
 *
 * @param type - The type identifier for the widget.
 * @returns A class decorator function.
 */
export function registerWidget(type: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function (constructor: any) {
    // Diese Funktion bleibt leer. Ihre einzige Aufgabe ist es,
    // im Code zu existieren, damit der Generator sie finden kann.
  };
}