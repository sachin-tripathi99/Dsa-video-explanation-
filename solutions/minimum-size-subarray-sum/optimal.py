class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        l = s = 0
        best = float("inf")
        for r, x in enumerate(nums):
            s += x
            while s >= target:                  # valid: record, then try shorter
                best = min(best, r - l + 1)
                s -= nums[l]
                l += 1
        return 0 if best == float("inf") else best
