FROM arm32v6/node:10.12-alpine as base
WORKDIR /app
EXPOSE 80
ENV PORT=80

FROM arm32v6/node:10.12-alpine as build
RUN yarn global add @luvies/take@0.0.9
WORKDIR /build
COPY . .
RUN take

FROM base as final
COPY --from=build /build/src/dist/* .
ENTRYPOINT [ "node", "index.js" ]
