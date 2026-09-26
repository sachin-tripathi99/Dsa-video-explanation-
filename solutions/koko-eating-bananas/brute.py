class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        k = 1
        while sum((p + k - 1) // k for p in piles) > h:
            k += 1
        return k
