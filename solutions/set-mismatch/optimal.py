class Solution:
    def findErrorNums(self, nums: List[int]) -> List[int]:
        i = 0
        while i < len(nums):
            home = nums[i] - 1
            if nums[i] != nums[home]:
                nums[i], nums[home] = nums[home], nums[i]
            else:
                i += 1
        for k, x in enumerate(nums):
            if x != k + 1:
                return [x, k + 1]               # the one misfit
        return []
