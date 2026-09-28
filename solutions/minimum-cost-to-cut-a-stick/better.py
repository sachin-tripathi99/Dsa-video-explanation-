from functools import cache

class Solution:
    def minCost(self, n: int, cuts: List[int]) -> int:
        c = [0] + sorted(cuts) + [n]

        @cache                                  # each piece once
        def best(i, j):
            if j - i < 2:
                return 0
            return c[j] - c[i] + min(best(i, k) + best(k, j) for k in range(i + 1, j))

        return best(0, len(c) - 1)
