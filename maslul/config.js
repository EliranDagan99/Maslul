// Don't commit this file to your public repos. This config is for first-run
//
exports.config = {
  callbackUri: "http://maslul.test.bsmch.net/auth/oauth/return",
  identityMetadata:
    "https://login.microsoftonline.com/c98fb553-0659-4746-aefd-c234de2a5cfc/oauth2/v2.0/token", // For using Microsoft you should never need to change this.
  clientID: "2cd06111-6841-421f-9bc7-1a5af6e60304",
  clientSecret: "k16:Wsal/vo8.0.[cAkBB56EV*enc7of", // if you are doing code or id_token code
  skipUserProfile: true, // for AzureAD should be set to true.
  state: false,
  tenant: "c98fb553-0659-4746-aefd-c234de2a5cfc"
};
