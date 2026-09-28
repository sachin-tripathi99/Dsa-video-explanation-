class Solution:
    def replaceWords(self, dictionary: List[str], sentence: str) -> str:
        root = {}
        for d in dictionary:
            cur = root
            for ch in d:
                cur = cur.setdefault(ch, {})
            cur["$"] = True
        out = []
        for w in sentence.split():
            cur, i = root, 0
            while "$" not in cur and i < len(w) and w[i] in cur:
                cur = cur[w[i]]
                i += 1
            out.append(w[:i] if "$" in cur else w)     # first ✓ on the walk
        return " ".join(out)
