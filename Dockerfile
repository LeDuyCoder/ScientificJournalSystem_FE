# Build stage
FROM node:22-alpine as build
WORKDIR /app

# Copy package.json và package-lock.json để tận dụng cache
COPY package.json package-lock.json ./
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Build ứng dụng Vite
RUN npm run build

# Production stage
FROM nginx:alpine
# Copy file build từ stage trước sang thư mục serve của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Mở port 80
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
