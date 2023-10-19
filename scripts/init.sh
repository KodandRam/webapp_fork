#!/bin/bash

sleep 10
sudo chmod 755 /opt
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get clean

sudo apt-get install -y ca-certificates curl gnupg
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
NODE_MAJOR=20
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
sudo apt-get update && sudo apt-get install nodejs -y

echo "Verifying Node.js installation..."
node -v
echo "Verifying npm installation..."
npm -v
sudo apt-get install zip unzip

echo "Updating package list and installing PostgreSQL..."
sudo apt update
sudo apt-get install -y postgresql postgresql-contrib

sudo systemctl start postgresql
sudo systemctl enable postgresql

sudo -u postgres psql -c "create user $DB_USERNAME with encrypted password '$DB_PASSWORD';"
sudo -u postgres psql -c "alter user $DB_USERNAME with superuser;"

sudo unzip -o /home/admin/webapp.zip -d /usr/local/webapp || { echo "Failed to unzip webapp.zip"; exit 1; }

if [ $? -ne 0 ]; then
    echo "Error unzipping the file. Exiting."
    exit 1
fi

cd /usr/local/webapp || { echo "Directory not found"; exit 1; }



sudo bash -c "cat > /usr/local/webapp/.env <<EOF
DB_PORT=${DB_PORT}
DB_NAME=${DB_NAME}
PORT=${PORT}
ENV_TYPE=${ENV_TYPE}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=${DB_HOST}
DB_DIALECT=${DB_DIALECT}
EOF"



for i in {1..30}; do
    if sudo -u postgres psql -c '\l'; then
        break
    fi
    
    sleep 10
done

[ -d node_modules ] && rm -rf node_modules

sudo npm install || { echo "Error installing npm packages. Exiting."; exit 1; }
sleep 2