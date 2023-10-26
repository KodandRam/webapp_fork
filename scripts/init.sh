#!/bin/bash

sleep 10
sudo chmod 755 /opt
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get clean

# Install Node.js and npm
echo "Downloading and installing Node.js..."
sudo apt-get install -y ca-certificates curl gnupg
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
NODE_MAJOR=20
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
sudo apt-get update && sudo apt-get install nodejs -y

# Verify the Node.js and npm installation
echo "Verifying Node.js installation..."
node -v
echo "Verifying npm installation..."
npm -v

# Install zip unzip package
sudo apt-get install zip unzip

# Update package list and install PostgreSQL
echo "Updating package list and installing PostgreSQL..."
sudo apt update
sudo apt-get install -y postgresql postgresql-contrib

# Start PostgreSQL service and enable it to start on boot
echo "Starting PostgreSQL service..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Setting up PostgreSQL user and database
echo "Setting up PostgreSQL user and database..."
sudo -u postgres psql -c "create user $DB_USERNAME with encrypted password '$DB_PASSWORD';"
sudo -u postgres psql -c "alter user $DB_USERNAME with superuser;"

sudo unzip -o /home/admin/webapp.zip -d /usr/local/webapp || { echo "Failed to unzip webapp.zip"; exit 1; }

echo "Contents after unzip:"
sudo ls -alh /home/admin/
sudo ls -alh /opt/
sudo ls -alh /usr/local/


if [ $? -ne 0 ]; then
    echo "Error unzipping the file. Exiting."
    exit 1
fi

sudo ls -R /usr/local
sudo chmod -R 755 /usr/local/
echo "Who am I?"
whoami

# cp /opt/users.csv /usr/local/webapp/opt/users.csv
cd /usr/local/webapp || { echo "Directory not found"; exit 1; }

# Create .env file in webapp directory
echo "Creating .env file in webapp directory..."

sudo bash -c "cat > /usr/local/webapp/.env <<EOF
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=${DB_HOST}
DB_DIALECT=${DB_DIALECT}
DB_PORT=${DB_PORT}
DB_NAME=${DB_NAME}
PORT=${PORT}
ENV_TYPE=${ENV_TYPE}
EOF"
echo ".env file created successfully."

sudo cat /usr/local/webapp/.env

echo "Waiting for PostgreSQL to start..."
for i in {1..30}; do
    if sudo -u postgres psql -c '\l'; then
        break
    fi
    echo "PostgreSQL not ready, waiting..."
    sleep 10
done

[ -d node_modules ] && rm -rf node_modules
# Build the app
sudo npm install || { echo "Error installing npm packages. Exiting."; exit 1; }
sleep 2