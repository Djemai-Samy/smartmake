FROM node:16.3.0-alpine as development

WORKDIR /<%= appName %>

COPY package*.json /<%= appName %>

COPY yarn*.lock  /<%= appName %>

RUN <%= packageManager %> install 

COPY . /<%= appName %>

<%_if(useTypescript){_%>
RUN <%= packageManager %> run build

# CMD ["node", "./dist/index.js"]
<%_ }else{_%>
# CMD ["node", "./src/index.js"]
<%_}_%>


FROM node:16.3.0-alpine as production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /<%= appName %>

COPY package*.json /<%= appName %>

COPY yarn*.lock  /<%= appName %>

RUN <%= packageManager %> install --only=production 

<%_if(useTypescript){_%>
COPY --from=development /<%= appName %>/dist /<%= appName %>/dist

CMD ["node", "./dist/index.js"]
<%_}else{_%>
COPY --from=development /<%= appName %>/src /<%= appName %>/src

CMD ["node", "./src/index.js"]
<%_}_%>
