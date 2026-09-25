class Solution:
    def minStoneSum(self, piles: List[int], k: int) -> int:
        for _ in range(k):
            m = max(range(len(piles)), key=lambda i: piles[i])   # scan for the largest
            piles[m] -= piles[m] // 2
        return sum(piles)
