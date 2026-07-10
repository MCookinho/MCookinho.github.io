#!/usr/bin/env python3
import json, glob, os

BASE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'rankings')

def write_json(path, data):
    keys = list(data[0].keys()) if data else []
    with open(path, 'w') as f:
        f.write('[\n')
        for i, item in enumerate(data):
            f.write('  {\n')
            for j, k in enumerate(keys):
                if k not in item:
                    continue
                comma = ',' if j < len(keys) - 1 else ''
                v = item[k]
                if isinstance(v, str):
                    f.write(f'    "{k}": "{v}"{comma}\n')
                elif isinstance(v, float):
                    f.write(f'    "{k}": {v}{comma}\n')
                elif isinstance(v, int):
                    f.write(f'    "{k}": {v}{comma}\n')
                elif isinstance(v, bool):
                    f.write(f'    "{k}": {"true" if v else "false"}{comma}\n')
                else:
                    f.write(f'    "{k}": {json.dumps(v)}{comma}\n')
            if i < len(data) - 1:
                f.write('  },\n\n')
            else:
                f.write('  }\n')
        f.write(']\n')

def main():
    for path in sorted(glob.glob(os.path.join(BASE, '*.json'))):
        with open(path) as f:
            data = json.load(f)
        name = os.path.basename(path)
        before = len(data)
        data.sort(key=lambda x: x.get('name', '').lower())
        write_json(path, data)
        print(f'{name}: {before} entries sorted')

if __name__ == '__main__':
    main()
