FROM nginx:alpine

# Copy your files
COPY index.html /usr/share/nginx/html/
COPY entrypoint.sh /docker-entrypoint.d/40-replace-env-variables.sh

# Make the entrypoint script executable
RUN chmod +x /docker-entrypoint.d/40-replace-env-variables.sh

# Make sure the nginx configuration allows access
RUN chmod 644 /usr/share/nginx/html/index.html