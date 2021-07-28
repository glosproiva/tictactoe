FROM nginx:1.13.6
RUN rm -rf /usr/share/nginx/html/*
COPY ./nginx/config/nginx.conf /etc/nginx/conf.d
WORKDIR /usr/share/nginx/html

# COPY ./nginx/config/hfile  ./.htaccess
# COPY  /src .
CMD chmod 775 -R /usr/share/nginx/html
