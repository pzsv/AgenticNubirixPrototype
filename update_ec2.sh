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

echo "------------------------------------------------"
echo "Update complete!"
echo "The app has been restarted with the latest code."
echo "------------------------------------------------"
