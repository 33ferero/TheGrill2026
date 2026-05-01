import { type PageModule, PageType } from "../../types/page";

const pageModules = import.meta.glob<PageModule>("./*.tsx", { eager: true });
const order = Object.values(PageType);

/** Every `<Name>Page.tsx` in this folder, ordered like the `PageType` enum. */
const pageRegistry = Object.entries(pageModules)
  .map(([path, mod]) => {
    const id = path.match(/\.\/([A-Za-z]+)Page\.tsx$/)?.[1]?.toLowerCase() as PageType;
    if (!order.includes(id)) {
      throw new Error(`Cannot infer PageType from module path: ${path}`);
    }
    return { id, Component: mod.default };
  })
  .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

export default pageRegistry;
