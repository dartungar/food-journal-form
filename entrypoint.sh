#!/bin/sh

# Replace environment variables in the HTML file
sed -i "s|%%API_URL%%|${API_URL}|g" /usr/share/nginx/html/index.html
sed -i "s|%%IMAGE_1_PATH%%|${IMAGE_1_PATH}|g" /usr/share/nginx/html/index.html
sed -i "s|%%IMAGE_2_PATH%%|${IMAGE_2_PATH}|g" /usr/share/nginx/html/index.html

# Execute nginx
exec nginx -g 'daemon off;'