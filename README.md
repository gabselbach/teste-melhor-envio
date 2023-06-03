# :bar_chart: Sitema de Logs

Sistema desenvolvido para processar os logs geradas por um sistema de API Gateway.

### Tecnologias
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

## Dependências
Para você rodar o projeto precisa ter instalado em sua máquina o Docker. Caso não tenha entre na [documentação](https://docs.docker.com/engine/install/) para instalar

## Executar o sistema  

### Setup do projeto 
Altere o nome do arquivo .env.example somente para .env e siga os próximos passos.

Para executar o projeto rode 

```bash
docker-compose up -d 
```
### Rodar a migração
Para deixar o banco de dados funcional rode no terminal 

```bash
npm run typeorm migration:run -- -d src/ormconfig.ts
```
### Setup de arquivo
dentro da pasta src/loggers/files existe um arquivo que foi usado para teste menor chamado logs.txt, você pode substituir ele pelo arquivo original.

## Como processar os logs
Você pode usar a ferramenta que preferir para fazer Requests, eu recomendo o [Postman](https://www.postman.com/). Será necessário fazer uma request para o endpoint:

> GET: http://localhost:3000/loggers

Essa requisição gerará dois arquivos csv dentro da pasta /src/loggers/files:

> averageLoggers.csv 
...

 - Requisições por serviço
 - Tempo médio de request , proxy e gateway por serviço.
 
> customerPerRequest.csv 
...

 - Requisições por consumidor;

Está requisição também salva as informações no banco de dados, mas para arquivos grandes é possível que a requisição demore, até salvar todos os dados.

## Visualização do banco de dados

Foi criado um container para o phpMyAdmin, onde é possível ver os dados, pelo navegador acessando:

```
http://localhost:8080
```
Os dados de User e password estão do arquivo .env

## Melhorias
Está foi uma versão do sistema que pode ser melhora com os seguintes pontos:

- [ ] Criar endpoints separados para armazenar as informações e outro para geração dos csvs;
- [ ] Usar como banco de dados o MongoDB. Acredito que  ele é bem mais indicado para esse tipo de sistema.
- [ ] Desenvolver um sistema de login e proteger as rotas com jwt
- [ ] Descrever as apis usando swagger 
- [ ] Implementar mais testes
- [ ] Caso deseje continuar usando mysql é interessante pesquisar e implementar um sistema de pools para otimizar a escrita no banco.
 