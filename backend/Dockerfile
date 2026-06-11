FROM node:21 AS backend-builder

WORKDIR /app

COPY . .

RUN npm install

FROM node:21-slim

WORKDIR /app

COPY --from=backend-builder /app .



EXPOSE 8000

CMD ["npm ","start"]  
