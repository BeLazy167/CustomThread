#!/bin/bash
# Update system
sudo dnf update -y

# Install Docker
sudo dnf install -y docker
sudo systemctl enable docker
sudo systemctl start docker

# Add users to docker group
sudo usermod -aG docker ec2-user
sudo usermod -aG docker jenkins


# Install Java 17 (Jenkins dependency)
sudo dnf install -y java-17-amazon-corretto-devel

# Add Jenkins repository
sudo wget -O /etc/yum.repos.d/jenkins.repo \
    https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key

# Install Jenkins
sudo dnf install -y jenkins

# Start and enable Jenkins
sudo systemctl enable jenkins
sudo systemctl start jenkins

# Install Git
sudo dnf install -y git

# Install latest Node.js 20 or up
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Wait for Jenkins initial setup
echo "Waiting for Jenkins initialization..."
while [ ! -f /var/lib/jenkins/secrets/initialAdminPassword ]; do
    sleep 10
done

# Save initial admin password to ec2-user home
INIT_PASS=$(cat /var/lib/jenkins/secrets/initialAdminPassword)
echo "Jenkins Initial Admin Password: $INIT_PASS" > /home/ec2-user/jenkins_initial_password.txt
chown ec2-user:ec2-user /home/ec2-user/jenkins_initial_password.txt

# Restart services to apply group permissions
sudo systemctl restart docker
sudo systemctl restart jenkins

# Create customthreads directory
mkdir -p /home/ec2-user/customthreads

# Print completion message
echo "Installation complete! Jenkins password saved to ~/jenkins_initial_password.txt"
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo "Git version: $(git --version)"

