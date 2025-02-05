# PHX API
A Simple temporary RESTful API and User DB

## Dev
This just uses `node >=20.17.0` (with npm) and `wrangler >=3.101.0`.

Since this API uses JWT and an API key, make sure to run this first:
```sh
echo "JWT_SECRET=<secret>\nAPI_KEY=<key>" > .dev.vars
```

Then the usual:
```sh
npm i
npm run dev
```

And run `curl http://localhost:8787/` to get going.
