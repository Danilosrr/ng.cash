## Technologies

- REST APIs
- Node.js
- TypeScript
- PostgreSQL
- Prisma
- Docker
- React

---

## Usage

- crie um arquivo .env dentro da pastar back-end seguindo a seguinte estrutura:

```dosini
    POSTGRES_USER=
    POSTGRES_PASSWORD=
    POSTGRES_DB=
    DATABASE_URL=postgresql://POSTGRES_USER:POSTGRES_PASSWORD@db:5432/POSTGRES_DB

    CRYPTR_KEY=
    JWT_KEY=
```

- iniciar o projeto utilizando Docker:

```bash
    $ git clone https://https://github.com/Danilosrr/ng.cash
    $ cd ng.cash/
    $ docker-compose up --build
```

- outra alternativa, é utilizar os seguintes comandos na em um terminal na pasta back-end e no front-end respectivamente:

```bash
    $ npm i && npm run dev
```
```bash 
    $ npm i && npm run start
```

Feita a instalação você pode acessar a aplicação em: http://localhost:3000/