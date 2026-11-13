import os

base = r'C:\Users\hi\OneDrive\Desktop\vibecheck-github-files'
zip_file = r'C:\Users\hi\OneDrive\Desktop\vibecheck-github-files.zip'

if os.path.exists(zip_file):
    print(f"ZIP size: {os.path.getsize(zip_file) / (1024*1024):.2f} MB")

large_files = []
for root, dirs, files in os.walk(base):
    for f in files:
        fp = os.path.join(root, f)
        sz = os.path.getsize(fp) / (1024*1024)
        if sz > 1.0:
            large_files.append((os.path.relpath(fp, base), sz))

large_files.sort(key=lambda x: x[1], reverse=True)
print("Large files:")
for rel, sz in large_files[:15]:
    print(f"{rel}: {sz:.2f} MB")
