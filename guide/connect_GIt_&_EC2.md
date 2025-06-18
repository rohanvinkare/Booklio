# Connect EC2 with GitHub Actions for CI/CD

## Step-by-Step Guide

### 1. **Create an SSH Key Pair**

If you don’t have one already:

```bash
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github-action-key
```

- This will create two files:
  - **Private key**: `github-action-key`
  - **Public key**: `github-action-key.pub`

### 2. **Copy the Public Key to EC2**

SSH into your EC2 instance:

```bash
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

Then, on the EC2 instance:

```bash
mkdir -p ~/.ssh
echo "PASTE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 3. **Add the Private Key to GitHub Secrets**

In your GitHub repo:

- Go to **Settings → Secrets → Actions**.
- Add a new secret:
  - Name: `EC2_SSH_KEY`
  - Value: **Contents of `github-action-key`** (private key)

Also add these:

- `EC2_USER` → e.g., `ec2-user`
- `EC2_HOST` → Public IP or DNS of your EC2 instance

### 4. **Write GitHub Actions Deploy Step**

Here’s how the deploy job might look:

```yaml
jobs:
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up SSH key
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.EC2_SSH_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan -H ${{ secrets.EC2_HOST }} >> ~/.ssh/known_hosts

      - name: Deploy code to EC2
        run: |
          ssh ${{ secrets.EC2_USER }}@${{ secrets.EC2_HOST }} "cd /path/to/app && git pull && docker-compose up -d"
```

### Tips for Security

- Never expose your private key in logs (`chmod 600 ~/.ssh/id_rsa` prevents this).
- Use a **deploy user** on EC2 with limited access if possible.
- Optionally, use a deployment script on EC2 (`deploy.sh`) to keep the GitHub workflow clean.
