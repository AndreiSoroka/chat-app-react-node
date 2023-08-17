FROM node:18 AS builder-packages
ARG API_HOST
ARG PORT
ENV IS_DOCKER_BUILD=1
ENV HUSKY=0
ENV API_HOST=${API_HOST}
ENV PORT=${PORT}

WORKDIR /app
COPY ./package*.json ./
COPY ./frontend/package*.json ./frontend/
RUN npm --production=false ci -w frontend

FROM builder-packages AS builder-src
COPY ./frontend ./frontend

FROM builder-src AS check-app__type-check
RUN npm run type-check  -w frontend

FROM builder-src AS check-app__lint
RUN npm run lint -w frontend

#FROM builder-src AS check-app__stylelint
#RUN #npm run stylelint

#FROM builder-src AS check-app__prettier
#RUN npm run prettier

FROM builder-src AS builder-dist
RUN npm run build-only -w frontend

FROM builder-dist AS devserver

# It's parallel tasks for docker build-kit if you use it
COPY --from=check-app__lint /app/package.json /home/lint-package.json
COPY --from=check-app__type-check /app/package.json /home/type-check-package.json

CMD ["sh", "-c", "npm run preview -w frontend -- --host --port $PORT"]
