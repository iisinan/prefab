FROM nginx:alpine
# Change Nginx default port from 80 to 8080 to match Railway target port
RUN sed -i 's/listen \(.*\) 80;/listen 8080;/' /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
