class Solution:
    def sortArray(self, nums: List[int]) -> List[int]:
        for i in range(1, len(nums)):
            x, j = nums[i], i - 1
            while j >= 0 and nums[j] > x:      # shift bigger right
                nums[j + 1] = nums[j]
                j -= 1
            nums[j + 1] = x
        return nums
