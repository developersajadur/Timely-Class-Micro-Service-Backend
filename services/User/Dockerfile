FROM node:20-alpine
WORKDIR /app
COPY package.json yarn.lock ./
COPY prisma ./prisma
RUN yarn install --frozen-lockfile
COPY . .
EXPOSE 5001
CMD ["yarn", "dev"]
