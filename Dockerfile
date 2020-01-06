FROM node:10

ENV http_proxy 'http://bsmchinternet:Proxybsmch@10.0.0.10:80'
ENV NODE_ENV "production"

# npm behind proxy
RUN npm config set proxy http://10.0.0.10:80
RUN npm config set https-proxy http://10.0.0.10:80

WORKDIR /usr/src/app

COPY ./maslul/package*.json ./

COPY ./maslul .

RUN npm install

EXPOSE 80

CMD [ "npm", "start" ]
