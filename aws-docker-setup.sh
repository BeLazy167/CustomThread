#!/bin/bash

# Script to optimize Docker settings on Amazon Linux for Jenkins use
# Run with sudo for best results

# Print banner
echo "====================================================="
echo "Docker Optimization Script for Amazon Linux EC2"
echo "====================================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Warning: Not running as root. Some operations may fail."
  echo "Recommend running with sudo."
  exit 1
fi

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
  echo "Docker not found. Installing..."
  amazon-linux-extras install docker -y
  systemctl start docker
  systemctl enable docker
  usermod -aG docker ec2-user
  usermod -aG docker jenkins || true
else
  echo "Docker is already installed"
fi

# Create Docker configuration directory if it doesn't exist
mkdir -p /etc/docker

# Configure Docker daemon with optimized settings
echo "Optimizing Docker daemon settings..."
cat > /etc/docker/daemon.json <<EOF
{
  "data-root": "/var/lib/docker",
  "storage-driver": "overlay2",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "experimental": true,
  "metrics-addr": "0.0.0.0:9323",
  "live-restore": true,
  "max-concurrent-downloads": 10,
  "max-concurrent-uploads": 10,
  "registry-mirrors": [],
  "features": {
    "buildkit": true
  }
}
EOF

# Restart Docker service
echo "Restarting Docker service..."
systemctl restart docker

# Create dedicated directory for Docker storage (if needed)
if [[ -b /dev/xvdb && ! -d /docker-data ]]; then
  echo "Setting up dedicated EBS volume for Docker..."
  mkdir -p /docker-data
  mkfs -t xfs /dev/xvdb || true
  echo "/dev/xvdb /docker-data xfs defaults 0 0" >> /etc/fstab
  mount -a
  
  # Stop Docker, migrate data, and update config
  systemctl stop docker
  rsync -aqxP /var/lib/docker/ /docker-data/
  rm -rf /var/lib/docker
  ln -s /docker-data /var/lib/docker
  systemctl start docker
fi

# Create disk usage monitoring script
echo "Creating disk usage monitor script..."
cat > /usr/local/bin/monitor-docker-disk.sh <<EOF
#!/bin/bash
THRESHOLD=85
USAGE=\$(df -h | grep '/dev/xvda1' | awk '{print \$5}' | sed 's/%//')

if [ \$USAGE -gt \$THRESHOLD ]; then
  echo "Disk usage is high (\${USAGE}%). Cleaning up Docker resources..."
  docker system prune -af --volumes
fi
EOF

chmod +x /usr/local/bin/monitor-docker-disk.sh

# Set up cron job to run monitoring script
echo "Setting up cron job for disk monitoring..."
(crontab -l 2>/dev/null; echo "0 * * * * /usr/local/bin/monitor-docker-disk.sh") | crontab -

# Print Docker info
echo "Docker configuration complete. Current Docker info:"
docker info

echo "Docker optimization completed!" 