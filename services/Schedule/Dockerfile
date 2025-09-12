FROM node:20-alpine
WORKDIR /app
COPY package.json yarn.lock ./
COPY prisma ./prisma
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
EXPOSE 5002
CMD ["yarn", "start"]
