class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        counts = {}
        for x in nums:
            counts[x] = counts.get(x, 0) + 1
            if counts[x] > len(nums) // 2:
                return x
        return -1
