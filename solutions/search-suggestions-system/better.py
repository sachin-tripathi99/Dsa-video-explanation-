from bisect import bisect_left

class Solution:
    def suggestedProducts(self, products: List[str], searchWord: str) -> List[List[str]]:
        products.sort()
        res = []
        for i in range(1, len(searchWord) + 1):
            p = searchWord[:i]
            lo = bisect_left(products, p)       # first product ≥ prefix
            res.append([s for s in products[lo:lo + 3] if s.startswith(p)])
        return res
