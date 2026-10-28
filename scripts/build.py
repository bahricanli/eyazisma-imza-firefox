from pathlib import Path
import zipfile,json
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'extension/manifest.json').read_text())
output=root/'dist';output.mkdir(exist_ok=True)
name=root.name+'-'+manifest['version']+'.zip'
with zipfile.ZipFile(output/name,'w',zipfile.ZIP_DEFLATED) as archive:
 for path in sorted((root/'extension').rglob('*')):
  if path.is_file(): archive.write(path,path.relative_to(root/'extension'))
print(output/name)
