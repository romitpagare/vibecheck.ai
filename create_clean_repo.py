import os
import zipfile
import shutil

src = r'C:\Users\hi\.gemini\antigravity\scratch\melodymind'
zip_dest = r'C:\Users\hi\OneDrive\Desktop\vibecheck-github-files.zip'
extract_dir = r'C:\Users\hi\OneDrive\Desktop\vibecheck-github-files'

exclude_dirs = {'node_modules', 'dist', '.venv', '__pycache__', '.git', 'uploads', 'data'}
exclude_exts = {'.wav', '.mp3', '.m4a', '.ogg', '.flac', '.pyc', '.pyo', '.db', '.zip'}

if os.path.exists(zip_dest):
    os.remove(zip_dest)

print("Creating clean lightweight zip for GitHub (under 25MB)...")
with zipfile.ZipFile(zip_dest, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(src):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in exclude_exts or f == 'package_repo.py' or f.startswith('check_'):
                continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, src)
            zipf.write(full_path, rel_path)
    zipf.writestr('backend/uploads/.gitkeep', '')

sz = os.path.getsize(zip_dest) / (1024 * 1024)
print(f"NEW ZIP SIZE: {sz:.2f} MB")

# Also re-extract to Desktop folder
if os.path.exists(extract_dir):
    shutil.rmtree(extract_dir)
os.makedirs(extract_dir, exist_ok=True)
with zipfile.ZipFile(zip_dest, 'r') as zipf:
    zipf.extractall(extract_dir)

print("SUCCESS: Clean folder extracted to Desktop.")
