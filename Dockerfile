FROM mcr.microsoft.com/playwright:v1.52.0-noble
WORKDIR /app
COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/rules/package.json packages/rules/package.json
COPY packages/scanner/package.json packages/scanner/package.json
COPY packages/reports/package.json packages/reports/package.json
RUN npm install
COPY . .
RUN npm run build
ENV PORT=3001
EXPOSE 3001
CMD ["npm","run","start","-w","@gigw/api"]
