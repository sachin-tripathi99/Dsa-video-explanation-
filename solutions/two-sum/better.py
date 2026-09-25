class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        idx = sorted(range(len(nums)), key=lambda i: nums[i])   # sort indices by value
        l, r = 0, len(nums) - 1
        while l < r:
            s = nums[idx[l]] + nums[idx[r]]
            if s == target:
                return [idx[l], idx[r]]
            if s < target:
                l += 1
            else:
                r -= 1
        return []
