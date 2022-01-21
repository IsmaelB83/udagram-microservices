## Base image
FROM beevelop/ionic:latest AS ionic

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies. package.json AND package-lock.json are copied
COPY package*.json ./

# Install dependencies
RUN npm instal

# Copy app source
COPY . .

# Build and run frontend
RUN ionic build
FROM nginx:alpine
COPY --from=ionic  /usr/src/app/www /usr/share/nginx/html