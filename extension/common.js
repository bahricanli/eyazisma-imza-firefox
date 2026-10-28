/* Only these portals may hand signing links to the local application. */
const EYAZISMA_HOST = 'com.bahricanli.eyazisma_imza';
const EYAZISMA_PORTALS = ['https://portal.lkd.org.tr', 'https://portal.pkd.org.tr'];
function validSigningLink(value, expectedOrigin) {
 try { const u = new URL(value);
 return EYAZISMA_PORTALS.includes(u.origin) && (!expectedOrigin || u.origin === expectedOrigin)
  && !u.username && !u.password && !u.search && !u.hash && /^\/imza\/[A-Za-z0-9_-]{16,256}$/.test(u.pathname)
  && u.href === u.origin + u.pathname;
 } catch { return false; }
}
if (typeof module !== 'undefined') module.exports = {validSigningLink, EYAZISMA_PORTALS};
