from functools import cache

class Solution:
    def maxCoins(self, nums: List[int]) -> int:
        p = [1] + nums + [1]

        @cache                                  # each interval once
        def best(i, j):
            return max((best(i, k) + best(k, j) + p[i] * p[k] * p[j] for k in range(i + 1, j)), default=0)

        return best(0, len(p) - 1)
