#!/bin/bash
set -e

echo "======================================"
echo " HOPE OS - KIOSK BUILD SCRIPT"
echo "======================================"

echo "[1/3] Building React Frontend..."
npm run build

echo "[2/3] Setting up Python Environment..."
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install pyinstaller

echo "[3/3] Packaging Python Native GTK4 App..."
# Build the executable
pyinstaller --onefile hope_os_kiosk.py

# Package everything into a deployment folder
echo "Creating deployment package in 'hope_os_deployment'..."
rm -rf hope_os_deployment
mkdir -p hope_os_deployment

# Copy the built executable
cp dist_pyinstaller/hope_os_kiosk hope_os_deployment/ 2>/dev/null || cp dist/hope_os_kiosk hope_os_deployment/ 2>/dev/null || echo "Warning: Executable not moved (Pyinstaller might have failed if GTK headers are missing on this OS)."

# Copy the frontend dist directory
cp -r dist hope_os_deployment/dist

# Copy the requirements and python script as fallback
cp hope_os_kiosk.py hope_os_deployment/
cp requirements.txt hope_os_deployment/

echo "======================================"
echo " BUILD COMPLETE!"
echo " Deployment folder 'hope_os_deployment' is ready."
echo " To run on target machine:"
echo "   cd hope_os_deployment"
echo "   ./hope_os_kiosk (if compiled successfully)"
echo "   OR: python3 hope_os_kiosk.py"
echo "======================================"
