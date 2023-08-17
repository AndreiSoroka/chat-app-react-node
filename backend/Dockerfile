FROM node:18 AS packages
ARG PORT
ENV HUSKY=0
ENV NODE_ENV=production
ENV PORT=${PORT}

WORKDIR /app
COPY ./package*.json ./
COPY ./backend/package*.json ./backend/
RUN npm --production=false ci -w backend

FROM packages AS source
COPY ./backend ./backend

FROM source AS lint
RUN npm run lint -w backend

FROM source AS Application

# It's parallel tasks for docker build-kit if you use it
COPY --from=lint /app/package.json /home/lint-package.json

# helth
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
 CMD curl --fail http://127.0.0.1:$PORT/api/ping || kill 1

CMD [ "npm", "start", "-w=backend" ]
