# Download sample images for Church Anniversary Website
# This script downloads high-quality images suitable for the website

# Create directories
New-Item -ItemType Directory -Path "public/assets/logo" -Force | Out-Null
New-Item -ItemType Directory -Path "public/assets/hero" -Force | Out-Null
New-Item -ItemType Directory -Path "public/assets/gallery" -Force | Out-Null
New-Item -ItemType Directory -Path "public/assets/background" -Force | Out-Null

Write-Host "Created asset directories" -ForegroundColor Green

# Image URLs (royalty-free images)
$images = @{
    "public/assets/logo/logo.png" = "https://via.placeholder.com/300x300/d4a652/ffffff?text=Church+Logo"
    "public/assets/hero/hero.jpg" = "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1920&h=1080&fit=crop"
    "public/assets/gallery/1.jpg" = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=800&fit=crop"
    "public/assets/gallery/2.jpg" = "https://images.unsplash.com/photo-1445521458279-d2b53557fe78?w=800&h=800&fit=crop"
    "public/assets/gallery/3.jpg" = "https://images.unsplash.com/photo-1516302752625-fcc13602d570?w=800&h=800&fit=crop"
    "public/assets/gallery/4.jpg" = "https://images.unsplash.com/photo-1514027620461-404badf42932?w=800&h=800&fit=crop"
    "public/assets/gallery/5.jpg" = "https://images.unsplash.com/photo-1530627346881-84a42c59a6c9?w=800&h=800&fit=crop"
    "public/assets/gallery/6.jpg" = "https://images.unsplash.com/photo-1533228100644-112a580dc935?w=800&h=800&fit=crop"
}

# Download images
$images.GetEnumerator() | ForEach-Object {
    $path = $_.Key
    $url = $_.Value
    Write-Host "Downloading: $path" -ForegroundColor Cyan
    try {
        Invoke-WebRequest -Uri $url -OutFile $path -UseBasicParsing
        Write-Host "✓ Downloaded: $path" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Failed to download: $path" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Yellow
    }
}

Write-Host "`nImage download complete!" -ForegroundColor Green
Write-Host "All images are ready for replacement in the public/assets/ directory"
