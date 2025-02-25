# hello-distr frontend

This is a tiny web application in next.js for Distr demonstration purposes.

It is based on the [hero-ui next.js template](https://www.heroui.com/docs/frameworks/nextjs) for creating applications using Next.js 14 (app directory) and HeroUI (v2).

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.
