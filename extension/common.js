/* Built-in portals; any other portal is added by the user and held as a browser permission. */
const EYAZISMA_HOST = 'com.bahricanli.eyazisma_imza';
const EYAZISMA_PORTALS = ['portal.lkd.org.tr', 'portal.pkd.org.tr', '*.eyazisma.com.tr'];
function builtInPortal(origin) {
 try { const u = new URL(origin);
 return u.protocol === 'https:' && !u.port && EYAZISMA_PORTALS.some(p => p.startsWith('*.') ? u.hostname === p.slice(2) || u.hostname.endsWith(p.slice(1)) : u.hostname === p);
 } catch { return false; }
}
function grantedPortals(permissions) {
 return permissions.getAll().then(granted => (granted.origins || []).map(pattern => /^(https:\/\/[^*/]+)\/\*$/.exec(pattern)?.[1]).filter(origin => origin && !builtInPortal(origin)));
}
function validSigningLink(value, expectedOrigin, added = []) {
 try { const u = new URL(value);
 return (builtInPortal(u.origin) || added.includes(u.origin)) && (!expectedOrigin || u.origin === expectedOrigin)
  && !u.username && !u.password && !u.search && !u.hash && /^\/imza\/[A-Za-z0-9_-]{16,256}$/.test(u.pathname)
  && u.href === u.origin + u.pathname;
 } catch { return false; }
}
if (typeof module !== 'undefined') module.exports = {validSigningLink, builtInPortal, grantedPortals, EYAZISMA_PORTALS};
