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

# Check if Git is installed and uninstall it
if dpkg -l | grep git; then
    echo "Git is already installed. Uninstalling..."
    sudo apt-get remove --purge git -y
fi

# Create a new user for the Node.js application
sudo useradd -m -s /bin/bash webapp_user

sudo mkdir /home/webapp_user/webapp
sudo unzip -o /home/admin/webapp.zip -d /home/webapp_user/webapp || { echo "Failed to unzip webapp.zip"; exit 1; }

if [ $? -ne 0 ]; then
    echo "Error unzipping the file. Exiting."
    exit 1
fi

echo "Contents after unzip:"
sudo ls -alh /home/admin/
sudo ls -alh /opt/

# Change Ownership and Set Permissions
sudo chown -R webapp_user:webapp_user /home/webapp_user
 
# Restrict directory permissions to be more secure (remove execute permissions for others)
sudo chmod -R 755 /home/webapp_user

# Create a log directory for webapp
sudo mkdir -p /var/log/webapp
sudo chown -R webapp_user:webapp_user /var/log/webapp
sudo chmod 755 /var/log/webapp

cd /home/webapp_user/webapp || { echo "Directory not found"; exit 1; }
# cp /opt/users.csv /home/webapp_user/webapp/opt/users.csv

# Create .env file in webapp directory
echo "Creating .env file in webapp directory..."

sudo bash -c "cat > /home/webapp_user/webapp/.env <<EOF
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

# Change ownership of the .env file to webapp_user
sudo chown webapp_user:webapp_user /home/webapp_user/webapp/.env

sudo cat /home/webapp_user/webapp/.env
 
[ -d node_modules ] && rm -rf node_modules
# Build the app
sudo npm install || { echo "Error installing npm packages. Exiting."; exit 1; }
sleep 4

# Create the systemd service file with sudo
sudo bash -c "cat <<EOF > /etc/systemd/system/csye6225_webapp.service
[Unit]
Description=Node.js Web App
Documentation=https://your-application-documentation-url
After=network.target
Wants=cloud-init.target
 
[Service]
User=webapp_user
WorkingDirectory=/home/webapp_user/webapp
EnvironmentFile=/home/webapp_user/webapp/.env
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=csye6225_webapp
 
[Install]
WantedBy=multi-user.target
EOF"
 
# Reload the systemd configuration
sudo systemctl daemon-reload
 
# Enable and start the service
sudo systemctl enable csye6225_webapp
sudo systemctl start csye6225_webapp
sudo systemctl restart csye6225_webapp

sudo wget https://amazoncloudwatch-agent.s3.amazonaws.com/debian/amd64/latest/amazon-cloudwatch-agent.deb

sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
sudo apt-get install -f

sudo systemctl daemon-reload
sudo systemctl enable amazon-cloudwatch-agent
sudo systemctl start amazon-cloudwatch-agent