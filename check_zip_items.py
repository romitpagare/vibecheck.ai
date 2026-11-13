import zipfile

z = zipfile.ZipFile(r'C:\Users\hi\OneDrive\Desktop\vibecheck-github-files.zip')
items = sorted(z.infolist(), key=lambda x: x.file_size, reverse=True)
for i in items[:15]:
    print(f"{i.filename}: {i.file_size / (1024*1024):.2f} MB")
