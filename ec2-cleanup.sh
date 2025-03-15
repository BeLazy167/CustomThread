#!/bin/bash

# Script to clean up disk space on Amazon Linux EC2 instances
# Run with sudo for best results

# Print banner
echo "====================================================="
echo "EC2 Amazon Linux Cleanup Script for Jenkins"
echo "====================================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Warning: Not running as root. Some operations may fail."
  echo "Recommend running with sudo."
fi

# Print current disk usage
echo "Current disk usage:"
df -h

# Clean package manager cache
echo -e "\nCleaning yum cache..."
yum clean all
rm -rf /var/cache/yum

# Clean logs
echo -e "\nCleaning up log files..."
find /var/log -type f -name "*.log*" -exec truncate -s 0 {} \;
find /var/log -type f -name "*.gz" -delete
journalctl --vacuum-size=50M

# Clean Docker
echo -e "\nCleaning Docker resources..."
docker system prune -af --volumes

# Get 5 largest directories and files
echo -e "\nLargest directories:"
du -ahx / | sort -rh | head -n 5 2>/dev/null

echo -e "\nLargest files:"
find / -xdev -type f -size +100M -exec ls -lh {} \; 2>/dev/null | sort -k 5 -rh | head -n 5

# Clean temp files
echo -e "\nCleaning temporary files..."
rm -rf /tmp/* /var/tmp/*

# Clean Jenkins specific areas
echo -e "\nCleaning Jenkins workspace..."
find /var/lib/jenkins/workspace -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
find /var/lib/jenkins/workspace -path "*/dist" -type d -exec rm -rf {} + 2>/dev/null || true

# Clean npm cache
echo -e "\nCleaning npm cache..."
npm cache clean --force || true

# Print new disk usage
echo -e "\nNew disk usage:"
df -h

echo -e "\nCleanup completed!" 