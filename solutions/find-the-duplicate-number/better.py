class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        lo, hi = 1, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if sum(x <= mid for x in nums) > mid:
                hi = mid                        # too many values ≤ mid: duplicate is ≤ mid
            else:
                lo = mid + 1
        return lo
