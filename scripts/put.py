#!/usr/bin/env python3
"""Write many files from one stdin bundle. Each file starts with a line '=== relative/path'."""
import os, sys

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cur, buf, written = None, [], []

def flush():
    if cur is None:
        return
    path = os.path.join(root, cur)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    text = "\n".join(buf).strip("\n") + "\n"
    with open(path, "w") as f:
        f.write(text)
    written.append(cur)

for line in sys.stdin.read().split("\n"):
    if line.startswith("=== "):
        flush()
        cur, buf = line[4:].strip(), []
    else:
        buf.append(line)
flush()
print(f"wrote {len(written)} files")
