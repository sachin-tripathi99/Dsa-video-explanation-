class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        if target not in nums:
            return [-1, -1]
        l = r = nums.index(target)
        while r + 1 < len(nums) and nums[r + 1] == target:
            r += 1
        return [l, r]
