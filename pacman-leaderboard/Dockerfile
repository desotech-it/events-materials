FROM node:18
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV PORT=80
COPY package.json .
COPY package-lock.json .
RUN ["npm", "install"]
COPY . .
ENTRYPOINT ["./bin/www"]
EXPOSE 80
