class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        for x in nums:
            if nums.count(x) > len(nums) // 2:
                return x
        return -1
