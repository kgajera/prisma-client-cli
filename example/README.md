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

Run `npm run cli <model> <operation> --help` to see which flags are available for a model operation. For example, you should see the following when running `npm run cli user findMany -- --help`:

```
USAGE
  $ example user findMany [--_csv] [--where.id.equals <value>] [--where.id.in <value>] [--where.id.notIn <value>] [--where.id.lt <value>] [--where.id.lte <value>] [--where.id.gt <value>] [--where.id.gte <value>] [--where.id.not
    <value>] [--where.id <value>] [--where.email.equals <value>] [--where.email.in <value>] [--where.email.notIn <value>] [--where.email.lt <value>] [--where.email.lte <value>] [--where.email.gt <value>] [--where.email.gte <value>]
    [--where.email.contains <value>] [--where.email.startsWith <value>] [--where.email.endsWith <value>] [--where.email.mode default|insensitive] [--where.email.not <value>] [--where.email <value>] [--where.name.equals <value>]
    [--where.name.in <value>] [--where.name.notIn <value>] [--where.name.lt <value>] [--where.name.lte <value>] [--where.name.gt <value>] [--where.name.gte <value>] [--where.name.contains <value>] [--where.name.startsWith <value>]
    [--where.name.endsWith <value>] [--where.name.mode default|insensitive] [--where.name.not <value>] [--where.name <value>] [--where.profile.id <value>] [--where.profile.bio <value>] [--where.profile.userId <value>] [--where.role.equals
    ADMIN|USER] [--where.role.in ADMIN|USER] [--where.role.notIn ADMIN|USER] [--where.role.not ADMIN|USER] [--where.role ADMIN|USER] [--orderBy.id asc|desc] [--orderBy.email asc|desc] [--orderBy.name asc|desc] [--orderBy.posts._count
    asc|desc] [--orderBy.profile.id asc|desc] [--orderBy.profile.bio asc|desc] [--orderBy.profile.userId asc|desc] [--orderBy.role asc|desc] [--cursor.id <value>] [--cursor.email <value>] [--take <value>] [--skip <value>] [--distinct
    id|email|name|role]

FLAGS
  --_csv
  --cursor.email=<value>
  --cursor.id=<value>
  --distinct=(id|email|name|role)
  --orderBy.email=(asc|desc)
  --orderBy.id=(asc|desc)
  --orderBy.name=(asc|desc)
  --orderBy.posts._count=(asc|desc)
  --orderBy.profile.bio=(asc|desc)
  --orderBy.profile.id=(asc|desc)
  --orderBy.profile.userId=(asc|desc)
  --orderBy.role=(asc|desc)
  --skip=<value>
  --take=<value>
  --where.email=<value>
  --where.email.contains=<value>
  --where.email.endsWith=<value>
  --where.email.equals=<value>
  --where.email.gt=<value>
  --where.email.gte=<value>
  --where.email.in=<value>
  --where.email.lt=<value>
  --where.email.lte=<value>
  --where.email.mode=(default|insensitive)
  --where.email.not=<value>
  --where.email.notIn=<value>
  --where.email.startsWith=<value>
  --where.id=<value>
  --where.id.equals=<value>
  --where.id.gt=<value>
  --where.id.gte=<value>
  --where.id.in=<value>
  --where.id.lt=<value>
  --where.id.lte=<value>
  --where.id.not=<value>
  --where.id.notIn=<value>
  --where.name=<value>
  --where.name.contains=<value>
  --where.name.endsWith=<value>
  --where.name.equals=<value>
  --where.name.gt=<value>
  --where.name.gte=<value>
  --where.name.in=<value>
  --where.name.lt=<value>
  --where.name.lte=<value>
  --where.name.mode=(default|insensitive)
  --where.name.not=<value>
  --where.name.notIn=<value>
  --where.name.startsWith=<value>
  --where.profile.bio=<value>
  --where.profile.id=<value>
  --where.profile.userId=<value>
  --where.role=(ADMIN|USER)
  --where.role.equals=(ADMIN|USER)
  --where.role.in=(ADMIN|USER)
  --where.role.not=(ADMIN|USER)
  --where.role.notIn=(ADMIN|USER)
```