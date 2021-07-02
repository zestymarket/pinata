# Pinata Forwarder

Pinata requires the use of keys and secret to upload files at the present moment. So we needed a service to call pinata on our behalf.

# Quickstart

**Configuring Pinata**
1. Set the Account Pin Policy under `Account > Profile > Account Pin Policy`. The more replications there are the higher the availability of your pins and the faster the speed of access.
However, more replications would result in a greater cost of storage.

1. Obtain an API key under `Developer > API Keys > New Key`.

1. Enable `pinFileToIPFS` and `pinJSONToIPFS` under API Endpoint Access. Keep everything in it's default. 

1. Give the key a notable name.

1. Save the `API Key`, `API Secret`, and `JWT` as we will need it for later

**Configure `node`**
1. Create a `.env` file in `node` with the Pinata `API Key`, `API Secret`, and `JWT` obtained by creating an API key on Pinata.
```
KEY=
SECRET=
JWT=
```

1. Check if you are able to run the server 
```
$ cd node
$ yarn
$ yarn start

Listening at http://localhost:5000

$ curl localhost:5000
Welcome to Zesty Market's pinning gateway! Add pins here
```

**Configure `nginx`**
1. We will need a ssl certificate. Obtain this from cloudflare. This setup is reliant on cloudflare as a CDN.

1. Place the certificates in `nginx/certificates`. Put the public and private key in `zesty.market.pem` and `zesty.market.key` respectively. Placeholder private and public keys are present already, replace those.

1. Under `nginx/nginx.conf`, you should remove the `0.0.0.0` from server if you do not need to test the deployment on your server.
```
server {
    server_name pinata.zesty.market 0.0.0.0;   <-- remove 0.0.0.0
}
```

**Start Docker-compose**
1. You can now run `docker compose up -d` to run the docker instance detached from the command line.


# API
**POST** `/api/pinFileToIPFS`
This endpoint accepts a multipart form with `file` as a field.

Response:
```
{
    IpfsHash: This is the IPFS multi-hash provided back for your content,
    PinSize: This is how large (in bytes) the content you just pinned is,
    Timestamp: This is the timestamp for your content pinning (represented in ISO 8601 format)
}
```

Example:
```javascript
const axios = require('axios');

export const pinJSONToIPFS = (JSONBody) => {
    const url = `<input_host_url>/api/pinJSONToIPFS`;
    return axios
        .post(url, JSONBody)
        .then(function (response) {
            //handle response here
        })
        .catch(function (error) {
            //handle error here
        });
};
```

**POST** `/api/pinJSONToIPFS`
This endpoint accepts a json file in the body.

Response:
```
{
    IpfsHash: This is the IPFS multi-hash provided back for your content,
    PinSize: This is how large (in bytes) the content you just pinned is,
    Timestamp: This is the timestamp for your content pinning (represented in ISO 8601 format)
}
```

Example:
```javascript
//imports needed for this function
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

export const pinFileToIPFS = () => {
    const url = `<input_host_url>/api/pinFileToIPFS`;

    let data = new FormData();

    // change fileInputElement to the html element accepting multpart forms on your client
    data.append('file', fileInputElement.files[0]); 

    return axios
        .post(url, data, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            }
        })
        .then(function (response) {
            //handle response here
        })
        .catch(function (error) {
            //handle error here
        });
};
```

