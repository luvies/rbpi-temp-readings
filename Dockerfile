FROM node:10.11-slim as base
WORKDIR /app
EXPOSE 80
ENV PORT=80

FROM node:10.11 as build
RUN yarn global add take@0.0.9
WORKDIR /src
COPY . .
RUN take

FROM base as final
COPY --from=build /src/dist .
ENTRYPOINT [ "node", "index.js" ]
