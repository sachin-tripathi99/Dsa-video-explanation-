class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        n = len(nums)
        P = [0] * (n + 1)
        for i, x in enumerate(nums):
            P[i + 1] = P[i] + x
        best = float("inf")
        for i in range(n):
            j = bisect_left(P, P[i] + target, i + 1)   # first j with P[j] >= P[i] + target
            if j <= n:
                best = min(best, j - i)
        return 0 if best == float("inf") else best
