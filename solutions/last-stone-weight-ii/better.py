from functools import cache

class Solution:
    def lastStoneWeightII(self, stones: List[int]) -> int:
        total = sum(stones)
        half = total // 2

        @cache                                  # largest reachable sum ≤ half
        def best(i, s):
            if i == len(stones):
                return s
            r = best(i + 1, s)
            if s + stones[i] <= half:
                r = max(r, best(i + 1, s + stones[i]))
            return r

        return total - 2 * best(0, 0)
