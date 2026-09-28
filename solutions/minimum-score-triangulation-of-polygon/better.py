from functools import cache

class Solution:
    def minScoreTriangulation(self, values: List[int]) -> int:
        @cache                                  # each range once
        def best(i, j):
            if j - i < 2:
                return 0
            return min(best(i, k) + best(k, j) + values[i] * values[k] * values[j] for k in range(i + 1, j))
        return best(0, len(values) - 1)
