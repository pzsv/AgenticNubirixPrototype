#!/bin/bash

# Navigate to the project directory (assuming the script is run from there)
# If not, you might need: cd /path/to/AgenticNubirixPrototype

# 1. Pull the latest changes from Git
echo "Pulling latest changes from git..."
git pull origin main

# 2. Activate virtual environment and update dependencies
echo "Updating dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 3. Restart the systemd service to apply changes
echo "Restarting the nubirix service..."
sudo systemctl restart nubirix

# 4. Check status
echo "Checking service status..."
sleep 2
if systemctl is-active --quiet nubirix; then
    echo "------------------------------------------------"
    echo "Update complete and service is ACTIVE!"
    echo "The app is running at http://$(curl -s http://checkip.amazonaws.com || echo '<EC2-PUBLIC-IP>'):8000"
    echo "------------------------------------------------"
else
    echo "------------------------------------------------"
    echo "WARNING: Update finished but service FAILED to start."
    echo "Run 'journalctl -u nubirix -e' to see error logs."
    echo "------------------------------------------------"
    exit 1
fi
