class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        def lower_bound(t):                     # first index with nums[i] >= t
            lo, hi = 0, len(nums)
            while lo < hi:
                mid = (lo + hi) // 2
                if nums[mid] >= t:
                    hi = mid
                else:
                    lo = mid + 1
            return lo

        first = lower_bound(target)
        if first == len(nums) or nums[first] != target:
            return [-1, -1]
        return [first, lower_bound(target + 1) - 1]
