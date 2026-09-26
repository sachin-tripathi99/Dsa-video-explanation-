class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        w = 1
        for r in range(1, len(nums)):
            if nums[r] != nums[w - 1]:          # new value: write it
                nums[w] = nums[r]
                w += 1
        return w
