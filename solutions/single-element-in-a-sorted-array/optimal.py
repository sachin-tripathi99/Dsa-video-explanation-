class Solution:
    def singleNonDuplicate(self, nums: List[int]) -> int:
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if mid % 2 == 1:
                mid -= 1                        # mid = first slot of a pair
            if nums[mid] == nums[mid + 1]:
                lo = mid + 2                    # still aligned: single is right
            else:
                hi = mid                        # alignment broken: single at mid or left
        return nums[lo]
