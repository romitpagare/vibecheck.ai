import os
import shutil
import zipfile

src = r'C:\Users\hi\.gemini\antigravity\scratch\melodymind'
zip_dest = r'C:\Users\hi\OneDrive\Desktop\vibecheck-github-files.zip'

exclude_dirs = {'node_modules', 'dist', '.venv', '__pycache__', '.git'}
exclude_files = {'melodymind.db'}

print("Packaging project for GitHub...")
with zipfile.ZipFile(zip_dest, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(src):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for f in files:
            if f in exclude_files or f.endswith(('.pyc', '.pyo')):
                continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, src)
            zipf.write(full_path, rel_path)

print(f"SUCCESS: {zip_dest}")
