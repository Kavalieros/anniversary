// Merge content + secrets into one config object.
(function () {
  const content = window.ANNIVERSARY_CONTENT || {};
  const secrets = window.ANNIVERSARY_SECRETS || {};

  window.ANNIVERSARY_CONFIG = {
    ...content,
    allowedEmails: secrets.allowedEmails || [],
    passphrases: secrets.passphrases || [],
    passphrase: secrets.passphrase || "",
  };
})();
