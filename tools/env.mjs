globalThis.window = { self: 1, top: 1, location: { href: '' }, matchMedia: () => ({ matches: false }), addEventListener() {}, removeEventListener() {} };
globalThis.document = { createElement: () => ({ getContext: () => null, width: 0, height: 0 }), documentElement: { classList: { contains: () => false } } };
globalThis.navigator = { userAgent: 'node', hardwareConcurrency: 8 };
globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
