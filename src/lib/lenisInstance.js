// Shared handle to the single Lenis instance so other systems (e.g. the
// page bulge) can read real scroll position without creating a 2nd scroller.
export const lenisRef = { current: null };
