class Solution:
    def suggestedProducts(self, products: List[str], searchWord: str) -> List[List[str]]:
        products.sort()
        res = []
        for i in range(1, len(searchWord) + 1):
            p = searchWord[:i]
            res.append([s for s in products if s.startswith(p)][:3])   # rescan every product
        return res
