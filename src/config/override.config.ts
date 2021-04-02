/* eslint-disable object-curly-newline */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-len */

export const overrideConfig = {
  // database: { connectionString: 'mongodb://localhost:27017/pets-hotel' },
  database: {
    connectionString: 'mongodb://admin:8cf9c4fec7834d16a446b1007b91f35f@localhost:27017/pets-hotel?authSource=admin',
  },
  cors: { whitelistUrls: true },
  api: {
    prefix: '/api',
    docsUrl: '/docs',
    docsJson: '/json',
  },
  firebase: {
    serviceAccount: {
      type: 'service_account',
      project_id: 'pets-hotel-develop',
      private_key_id: '4bfaf62786a80b946b072b36af53c377c36cd8c8',
      private_key:
        '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCg83hg5gYlczNj\nkAXQHG7md+k9KOwXLKa98Ac+SaOq3+vS5kOKQUnDK4Gi0qgHYL8ONHTyEQb1Prhk\nU1te/utNxAIz7u3oYR67O5MXUvxEeU9Xwjomb7A2WTXfTYDhtLOC4yJyMy7JP2gr\n6FL555fD51qd53IxS+K/MUHP7Dvxll7fYax8Gr2nDIXPSDqEpTWddpZV7flttC9Q\nSR4e/LXBmioFRtIeGZ4tE6N5lwHB3HlkRE7dfzu32hKHzpHy2NjwurfVsFuF6OIe\n+Nym5ix1tRINYARmqCTS2u1tBsgDxOTkHf3WCdgDrsiRLod3eGykkO9DfhQFHBfj\ncvSzjKJjAgMBAAECggEAKSPCd8Yj+QuWrZLBIZ467Jbm27arjgrgPflt6IprFsCw\npxIrXlns0EG9G5DL2ULt4uQepkca57HV8PLrjn8LRy/cPkkKr5Svhb0nDlWsXJZD\nZROkyHFQ8btgzUiisk59ee2zvsv9X/xglKSIHQ+I1865d1YS9q3GcgdVop9n/QqB\n1Vip4pLXIj30ZV4PnEux3unYp7dq9/Drcrd0PPjuwKOnKWYgggq3Zvwvc5hE1T11\n6ciw/435Zi47kCtXXHs6V5wxtDKCQWqia0lZi/pDE7FZPZiPObahC9FXidvwK+ZB\nWtG/vCRlbVoqwjWerOldaSMWarZ6eavCRwLRzhjmHQKBgQDeg4ivAGYov8C+a5SY\nWHfcxgnY/jg0erDCNxAyodRDw0diwUyv83HjGAnqzH5/np9tOBT7Z4Yl49drHXs1\nssICsRUR3GSd5Jkk+x2SlPNJ0qXYjYHtGIwldFKVxNkl55YS2Xcgh0yiqUigrIs1\nujRS0tCgApjORskcevbFUjnInQKBgQC5LDKd55Y0gIWS9299jQntjweT9Rm2UZbN\nSF6VZc3dOkbkUPR1IZTvPL9Z+cNjNNDwVwbmdt4PM3IeY4ynJL96lKtKUgVpp87f\nw1xP3V2Xr59h+6A/JETV1UERgDkn0wU53inonEV6ldxW0ayyWl3WvO/WITWjg0kO\nmyrFmwim/wKBgQCTA4y3MyhMHAUYyrNuxGTNNPskpzIzWiyW5RKKoWlBLDBqCxTD\n27CPPj6vJ1UctIzY+IjEYe278wFNADl7jROp+53UIy1HNNYKHO+4/TiQueBhZ31E\nTUerJ2O5GEnwRUZeRdfzYfE8N2SI4/dGFDSl1CuKzKxw/Uu6yXNpg54x8QKBgQCs\nmLO9VwU8fqcCa7vxzKp6UR0BHi4PMFFdmpz+p9uQ3ycA3SxemSSXMYoyNYmXSL2P\np6541kb46Dzwcl3B1ZDckwJtzbHZ314GV7QNhQodvsbSr5WYBRhcL9/sjhW4Nwrh\n+2AYvsBMGK8+BUXxICXjaEwszNuQQ2ivQpZFhdI0xQKBgE9VfwneAZm/WcKZOfgH\n5KpfbukXAPET7LenDOWQ/F3utWY8ly4VNkuKRutYfB2qPwca6cZ6+z/hi4eQOydj\nBBEwkX1bD8ChwP6bnqqGmAgoFHwOT8toa30q8l3UJnUBjgvI1PBBJA8tFGOOd3v7\nWxvrQ4Lgpv9eKhPg1rR67u/z\n-----END PRIVATE KEY-----\n',
      client_email: 'firebase-adminsdk-n2loy@pets-hotel-develop.iam.gserviceaccount.com',
      client_id: '108745577897174468789',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-n2loy%40pets-hotel-develop.iam.gserviceaccount.com',
    },
    databaseURL: 'https://pets-hotel-develop.firebaseio.com',
  },
  mailer: {
    gmail: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      account: 'bedandpetfirst@gmail.com',
      password: 'hqjhybkjvhehyvli',
    },
  },
};
