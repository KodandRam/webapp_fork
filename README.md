# webapp

## Cloud Computing (CSYE 6225)

# Project Setup

npm init
npm install
npm start
Running Tests - npx mocha tests/*.test.js

cd /Applications/Postgres.app/Contents/Versions/latest/bin
./psql -U nikhil -d postgres

lsof -i:8080
kill -9 **pid**

In psql terminal - SELECT version();
\l: List all databases.
\c postgres: Connect to the 'postgres' database.
\d assignments: Display the structure of the 'assignments' table.
\q: Quit the psql terminal.


SSH into your droplet - ssh -i ~/.ssh/digitalocean root@ip
Transfer your project files to the droplet - scp -i ~/.ssh/digitalocean zip_file_path root@ip:/opt
exit the SSH session - exit
cd /opt

steps to install node.js and postgres in Debian 12 VM running in Digital Ocean

node --version v16.17.0
npm --version 8.15.0
PostgreSQL 16.0

sudo apt update
sudo apt upgrade

which curl
/usr/bin/curl

# Using NodeSource distributions for specific version
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo apt install nodejs
sudo apt install npm

node --version
npm --version


sudo apt update
sudo apt install apt-transport-https lsb-release ca-certificates curl dirmngr gnupg

sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

sudo apt update
sudo apt install postgresql
sudo systemctl start postgresql
sudo systemctl enable postgresql-12

sudo su - postgres
psql -c "alter user postgres with password 'StrongAdminPassw0rd'"
psql

sudo -u postgres psql
sudo nano /etc/postgresql/**version**/main/pg_hba.conf


echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list

wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

sudo apt update

sudo apt install postgresql

systemctl status postgresql

sudo -u postgres psql

\q

# Directory should we host our applicaion in debian - /opt
-- 2 seats do we have to include in the GitHub 'teams' plan
-- GitHub organization - private project - fork - it to personal name space
-- integration test in github actions
GitHub Action Workflows - users.csv inside our directory for git CI Workflow actions
It should live with your test code and be copied to the right location for your tests to run
write actual integration tests - You cannot access that locally from your machine
integration test in github actions runner

yaml file is supposed to be in org Repo - to run the GitHub workflows
script in yaml file, the job will include run npm test
while running test for API endpoints, it searches for /opt/users.csv file
parse this file in GitHub action
