FROM node:18-alpine3.18

# RUN addgroup app && adduser -S -G app app

# USER app

WORKDIR /app

COPY package*.json ./

# COPY prisma ./prisma/

RUN npm ci

# change ownership of the /app directory to the app user
# USER root

# # change ownership of the /app directory to the app user
# # chown -R <user>:<group> <directory>
# # chown command changes the user and/or group ownership of for given file.
# RUN chown -R app:app .

# # change the user back to the app user
# USER app
COPY . . 

# Generate Prisma Client
# RUN npx prisma generate

EXPOSE 3001 

CMD npm run dev