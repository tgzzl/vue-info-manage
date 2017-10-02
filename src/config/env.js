let endpoint = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : document.location.origin;
let trustedDomainFullName = document.location.href.split('#')[0];

export {
  endpoint,
  trustedDomainFullName
}
