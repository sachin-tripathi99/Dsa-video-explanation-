class Solution:
    def suggestedProducts(self, products: List[str], searchWord: str) -> List[List[str]]:
        root = {}
        for s in sorted(products):              # sorted order → first 3 are smallest
            cur = root
            for ch in s:
                cur = cur.setdefault(ch, {"$": []})
                if len(cur["$"]) < 3:
                    cur["$"].append(s)
        res, cur = [], root
        for ch in searchWord:
            cur = cur.get(ch) if cur is not None else None   # one step per keystroke
            res.append(cur["$"] if cur is not None else [])
        return res
