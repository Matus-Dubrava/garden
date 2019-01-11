const version = 'v0';
const serverPort = 5000;
const localUrl = 'http://localhost:' + serverPort + '/garden/' + version;

const publicDnsName = '';
const publicBaseUrl = publicDnsName + ':' + serverPort + '/garden/' + version;

export const storeBaseUrl = localUrl + '/goods';
export const receiptsUrl = localUrl + '/receipts';
export const issueCardsUrl = localUrl + '/issue-cards';
export const usersUrl = localUrl + '/users';
