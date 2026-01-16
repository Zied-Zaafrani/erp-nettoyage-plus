FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm ci && npm run build

RUN test -f dist/main.js || (echo "ERROR: dist/main.js not found!" && exit 1)

EXPOSE 3000

CMD ["node", "dist/main.js"]