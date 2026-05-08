import { G28 } from "./g28-pdf-fields";

// Pre-generates all checkbox/function variants so we can do O(1) lookups.
function buildReverseMap(): Map<string, string> {
  const map = new Map<string, string>();

  function walk(node: object, path: string) {
    for (const [key, val] of Object.entries(node)) {
      const fullPath = path ? `${path}.${key}` : key;

      if (typeof val === "string") {
        map.set(val, fullPath);
      } else if (typeof val === "function") {
        // Probe indices 0-9 — covers all known checkbox arrays
        for (let i = 0; i < 10; i++) {
          try {
            const resolved = val(i);
            if (typeof resolved === "string") {
              map.set(resolved, `${fullPath}[${i}]`);
            }
          } catch {
            break;
          }
        }
      } else if (typeof val === "object" && val !== null) {
        walk(val, fullPath);
      }
    }
  }

  walk(G28, "");
  return map;
}

export const G28_REVERSE_MAP = buildReverseMap();
// e.g. "form1[0].#subform[0].Line4_DaytimeTelephoneNumber[0]" → "attorney.phone"
