class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        def best(i, prev):
            if i == len(nums):
                return 0
            res = best(i + 1, prev)             # skip nums[i]
            if nums[i] > prev:
                res = max(res, 1 + best(i + 1, nums[i]))   # take nums[i]
            return res
        return best(0, float("-inf"))
