# Use lightweight and secure official Nginx Alpine image
FROM nginx:alpine

# Metadata labels
LABEL maintainer="Student Task Manager Team"
LABEL description="Student Task Management System Production Web Server"
LABEL version="1.0.0"

# Remove default Nginx welcome assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy frontend application files into Nginx document root
COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY script.js /usr/share/nginx/html/script.js

# Expose HTTP port 80
EXPOSE 80

# Healthcheck instruction for container orchestration
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Launch Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
