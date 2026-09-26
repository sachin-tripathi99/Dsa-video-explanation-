class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        n = len(nums)
        i = 0
        while i < n:
            x = nums[i]
            if 1 <= x <= n and nums[x - 1] != x:   # in range and home not yet taken by x
                nums[i], nums[x - 1] = nums[x - 1], x
            else:
                i += 1
        for k in range(n):
            if nums[k] != k + 1:
                return k + 1
        return n + 1
