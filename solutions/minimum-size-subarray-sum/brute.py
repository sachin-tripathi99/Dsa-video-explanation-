class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        best = float("inf")
        for i in range(len(nums)):
            s = 0
            for j in range(i, len(nums)):
                s += nums[j]
                if s >= target:
                    best = min(best, j - i + 1)
                    break
        return 0 if best == float("inf") else best
