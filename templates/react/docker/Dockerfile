FROM node:16.3.0-alpine as development

WORKDIR /<%= appName %>

COPY package*.json /<%= appName %>

COPY yarn*.lock  /<%= appName %>

RUN <%= packageManager %> install 

COPY . /<%= appName %>

<%_if(useTypescript){_%>
RUN <%= packageManager %> run build
<%_}_%>



FROM nginx as production

EXPOSE <%= port %>

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=development /front/build /usr/share/nginx/html
