let endpoint = process.env.NODE_ENV === 'development' ? 'http://dev-wioms-wapp.com:8292' : document.location.origin;
let trustedDomainFullName = document.location.href.split('#')[0];

export {
  endpoint,
  trustedDomainFullName
}
