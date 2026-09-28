class Solution:
    def maxCoins(self, nums: List[int]) -> int:
        p = [1] + nums + [1]

        def best(i, j):                         # burst everything strictly between i and j
            return max((best(i, k) + best(k, j) + p[i] * p[k] * p[j] for k in range(i + 1, j)), default=0)   # k bursts last

        return best(0, len(p) - 1)
