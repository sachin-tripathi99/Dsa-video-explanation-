class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        lo, hi = 0, len(nums)                   # answer may be n
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] >= target:
                hi = mid                        # mid could be the answer
            else:
                lo = mid + 1
        return lo                               # same as bisect_left(nums, target)
