# Use the official Node.js image as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN npm install

ENV PORT=3000
ENV WHATSAPP_API_KEY=${WHATSAPP_API_KEY}
ENV DATABASE_URL=${DATABASE_URL}
ENV BOT_SERVICE_URL=${BOT_SERVICE_URL}
ENV WHATSAPP_SERVICE=${WHATSAPP_SERVICE}

# Build the project
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

CMD ["npx", "drizzle-kit", "generate"]
CMD ["npx", "drizzle-kit", "migrate"]

# Define the command to run the app
CMD ["npm", "start"]
