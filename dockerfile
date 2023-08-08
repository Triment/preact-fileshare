FROM node:18 AS Node
COPY . /web
WORKDIR /web
RUN   npm install && npm run ssr-build
ENTRYPOINT ["/bin/sh", "-c", "npm run prod" ]
