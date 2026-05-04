from PIL import Image

# Create a new image with black background
img = Image.new('RGB', (192, 192), color='black')

# Load the existing logo192.png
try:
    logo = Image.open('logo192.png').convert('RGBA')
    # Paste logo onto black background (centered)
    img.paste(logo, (0, 0), logo)
except Exception as e:
    print(f"Error loading logo: {e}")

# Save as favicon.ico
img.save('favicon.ico', format='ICO', sizes=[(192, 192)])
print("favicon.ico created successfully with black background")
