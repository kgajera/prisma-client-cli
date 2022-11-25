# Prisma Client CLI

## Getting Started

1. Run `npm install`
1. Run `cp .env.example .env` to create your environment file and set your database URL
1. Run `npm run migrate` to initialize database and run Prisma generators

## Using the CLI

Run `npm run cli` to see which models are available:

```
USAGE
  $ example [COMMAND]

TOPICS
  post
  profile
  user
```

Run `npm run cli <model>` to see which commands are available for a model. For example, you should see the following when running `npm run cli user`:

```
USAGE
  $ example user COMMAND

COMMANDS
  user createOne
  user deleteMany
  user deleteOne
  user findFirst
  user findMany
  user findUnique
  user updateMany
  user updateOne
  user upsertOne
```

Run `npm run cli <model> <operation> --help` to see which flags are available for a model operation. For example, you should see the following when running `npm run cli user createOne -- --help`:

```
USAGE
  $ example user createOne [--_csv] [--data.email <value>] [--data.name <value>] [--data.id <value>]

FLAGS
  --_csv
  --data.email=<value>
  --data.id=<value>
  --data.name=<value>
```