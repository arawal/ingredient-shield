#!/bin/bash

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is required but not installed. Please install it first."
    echo "On macOS: brew install imagemagick"
    echo "On Ubuntu: sudo apt-get install imagemagick"
    exit 1
fi

# Source icon
SOURCE_ICON="public/icon-512x512.png"

# Check if source icon exists
if [ ! -f "$SOURCE_ICON" ]; then
    echo "Source icon not found: $SOURCE_ICON"
    exit 1
fi

# Array of sizes to generate
SIZES=(72 96 128 144 152 167 180 256 384)

# Generate icons
for size in "${SIZES[@]}"; do
    echo "Generating ${size}x${size} icon..."
    convert "$SOURCE_ICON" -resize ${size}x${size} "public/icon-${size}x${size}.png"
done

# Generate splash screens for common iOS devices
echo "Generating splash screens..."
mkdir -p public/splash

# iPhone 14 Pro Max
convert "$SOURCE_ICON" -resize 1290x2796 -background white -gravity center -extent 1290x2796 "public/splash/iPhone_14_Pro_Max_portrait.png"

# iPhone 14 Pro
convert "$SOURCE_ICON" -resize 1179x2556 -background white -gravity center -extent 1179x2556 "public/splash/iPhone_14_Pro_portrait.png"

# iPhone 14 Plus, 13 Pro Max, 12 Pro Max
convert "$SOURCE_ICON" -resize 1284x2778 -background white -gravity center -extent 1284x2778 "public/splash/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png"

echo "Done! Generated all icons and splash screens."