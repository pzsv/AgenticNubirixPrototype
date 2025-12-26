#!/bin/bash

# Update and install dependencies
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv git

# Create a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install project requirements
pip install --upgrade pip
pip install -r requirements.txt

# Create a systemd service file for the app
cat <<EOF | sudo tee /etc/systemd/system/nubirix.service
[Unit]
Description=Nubirix Prototype FastAPI App
After=network.target

[Service]
User=$USER
WorkingDirectory=$(pwd)
ExecStart=$(pwd)/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Start and enable the service
sudo systemctl daemon-reload
sudo systemctl start nubirix
sudo systemctl enable nubirix

echo "------------------------------------------------"
echo "Deployment complete!"
echo "The app should be running at http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8000"
echo "------------------------------------------------"
