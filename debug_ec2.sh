#!/bin/bash

echo "=== Nubirix Deployment Debugger ==="

# 1. Check if the service is active
echo -n "[1/4] Checking nubirix.service status... "
if systemctl is-active --quiet nubirix; then
    echo "ACTIVE"
else
    echo "FAILED"
    echo "------------------------------------------------"
    echo "CRITICAL ERROR: The application service is NOT running."
    echo "Here are the last 20 lines of the error log:"
    echo "------------------------------------------------"
    sudo journalctl -u nubirix -n 20 --no-pager
    echo "------------------------------------------------"
fi

# 2. Check if the port is listening
echo -n "[2/4] Checking if port 8000 is listening... "
if command -v ss > /dev/null; then
    if ss -tuln | grep -q ":8000"; then
        echo "YES"
    else
        echo "NO"
    fi
elif command -v netstat > /dev/null; then
    if netstat -tuln | grep -q ":8000"; then
        echo "YES"
    else
        echo "NO"
    fi
else
    echo "UNKNOWN (neither ss nor netstat found)"
fi

# 3. Check for external connectivity (internal check)
echo -n "[3/4] Checking internal connectivity (localhost:8000)... "
if curl -s http://localhost:8000/api-status > /dev/null; then
    echo "OK"
else
    echo "FAILED"
fi

# 4. Check Public IP and Security Group Hint
echo "[4/4] Environment Info:"
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com || curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "  Public IP: $PUBLIC_IP"
echo "  URL: http://$PUBLIC_IP:8000"

# 5. Check for recent 404 errors (missing files)
echo ""
echo "[5/5] Checking for missing files (404 errors) in logs..."
if sudo journalctl -u nubirix --since "1 hour ago" | grep -q "404 Not Found"; then
    echo "WARNING: Found 404 errors in the last hour. Some files might be missing!"
    sudo journalctl -u nubirix --since "1 hour ago" | grep "404 Not Found" | tail -n 5
else
    echo "OK: No recent 404 errors found."
fi

echo ""
echo "Troubleshooting Tips:"
echo "- If [1/4] failed: The app crashed on startup. Run 'journalctl -u nubirix -e' to see why."
echo "- If [1/4] and [2/4] are OK but you can't access it from your browser:"
echo "  Check your AWS EC2 Security Group. You MUST allow INBOUND TCP traffic on port 8000 from 0.0.0.0/0."
echo "- If [3/4] failed but [1/4] is ACTIVE: The app might be bound to the wrong interface or port."
echo "=== End of Report ==="
