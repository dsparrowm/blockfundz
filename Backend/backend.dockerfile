# backend/Dockerfile (Development)
FROM node:20
# RUN addgroup app && adduser -S -G app app

# USER app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY . . 

EXPOSE 3001

CMD ["npm", "run", "dev"]

