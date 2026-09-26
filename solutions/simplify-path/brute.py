class Solution:
    def simplifyPath(self, path: str) -> str:
        parts = path.split("/")
        changed = True
        while changed:                          # rewrite until nothing changes
            changed = False
            clean = [p for p in parts if p not in ("", ".")]
            if clean != parts:
                parts, changed = clean, True
            for i, p in enumerate(parts):
                if p == "..":
                    parts = parts[:max(0, i - 1)] + parts[i + 1:]
                    changed = True
                    break
        return "/" + "/".join(parts)
