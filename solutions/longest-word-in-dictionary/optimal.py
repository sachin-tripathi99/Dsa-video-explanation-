class Solution:
    def longestWord(self, words: List[str]) -> str:
        root = {}
        for w in words:
            cur = root
            for ch in w:
                cur = cur.setdefault(ch, {})
            cur["$"] = w
        best = ""

        def dfs(node):
            nonlocal best
            for ch in sorted(k for k in node if k != "$"):   # letter order → ties resolved
                kid = node[ch]
                if "$" not in kid:
                    continue                    # only through word ends
                if len(kid["$"]) > len(best):
                    best = kid["$"]
                dfs(kid)

        dfs(root)
        return best
