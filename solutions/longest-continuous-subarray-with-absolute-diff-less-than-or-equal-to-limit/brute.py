class Solution:
    def longestSubarray(self, nums: List[int], limit: int) -> int:
        best = 0
        for i in range(len(nums)):
            mx = mn = nums[i]
            for j in range(i, len(nums)):
                mx, mn = max(mx, nums[j]), min(mn, nums[j])
                if mx - mn > limit:
                    break
                best = max(best, j - i + 1)
        return best
