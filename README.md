# BookLoop Web App

## Development

1. Application is working with Node.js 22 and larger. First of all make sure that your Node.js version is capatible with requirements.

2. Install dependencies. We use `pnpm` as package manager

```sh
pnpm install
```

3. Copy `.env.example` to new `.env`. You can do it by simply running following script:

```sh
pnpm copy:config
```

4. Launch the app:

```sh
# Optionally add -o flag to immediately open the app in a browser
pnpm dev
```

Once you run the script an app will run on port `3000`.
