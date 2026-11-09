# Deployment Instructions for SMU University Server

## Server Information
- **Server**: ugdev.cs-smu.ca
- **Username**: group26G@ugdev.cs-smu.ca
- **Password**: password

## Step 1: Connect to the Server

```bash
ssh group26G@ugdev.cs-smu.ca
```

When prompted, enter the password: `password`

## Step 2: Navigate to Web Directory

Once connected, navigate to your web hosting directory (typically `public_html` or `www`):

```bash
cd ~/public_html
# OR
cd ~/www
# OR check what directories are available
ls -la
```

## Step 3: Clone the Repository

Clone the repository from GitHub:

```bash
# Remove existing directory if it exists
rm -rf AAADM-conservation

# Clone the repository
git clone https://github.com/CSCI-AAADM/AAADM-conservation.git

# Navigate into the project
cd AAADM-conservation
```

## Step 4: Install Dependencies

```bash
# Make sure Node.js is available (check version)
node --version

# If Node.js is not available, you may need to use nvm or contact admin
# Install dependencies
npm install
```

## Step 5: Build the Project

```bash
# Build for production
npm run build

# This creates a 'dist' folder with the production files
```

## Step 6: Configure for Server Deployment

You have a few options:

### Option A: Serve from dist folder (if server supports Node.js)
```bash
# The dist folder contains the built files
# You may need to configure your server to serve from this directory
```

### Option B: Copy files to web root
```bash
# Copy built files to web root (adjust path as needed)
cp -r dist/* ~/public_html/
# OR if you need to keep the project structure
cp -r dist/* ~/public_html/AAADM-conservation/
```

## Step 7: Set Up Environment Variables (if needed)

If the server requires environment variables for Azure API keys:

```bash
# Create .env file (if not using server environment variables)
nano .env

# Add:
# VITE_AZURE_SPEECH_KEY=your_key_here
# VITE_AZURE_REGION=your_region_here
```

## Step 8: Configure Server (if needed)

You may need to:
1. Configure Apache/Nginx to serve the SPA correctly
2. Set up redirects for client-side routing
3. Configure environment variables in server settings

## Alternative: Direct File Transfer

If SSH/command line is not preferred, you can use SFTP:

1. Use an SFTP client (FileZilla, WinSCP, etc.)
2. Connect to: `ugdev.cs-smu.ca`
3. Username: `group26G`
4. Password: `password`
5. Upload the `dist` folder contents to your web directory

## Quick One-Line Clone and Setup

```bash
ssh group26G@ugdev.cs-smu.ca "cd ~/public_html && git clone https://github.com/CSCI-AAADM/AAADM-conservation.git && cd AAADM-conservation && npm install && npm run build"
```

## Notes

- Make sure Node.js and npm are installed on the server
- The server may need to be configured to serve static files from the `dist` directory
- For SPA routing, ensure the server is configured to redirect all routes to `index.html`
- Environment variables for Azure API keys should be set in the server configuration, not in a `.env` file in production

