class Solution:
    def countSmaller(self, nums: List[int]) -> List[int]:
        n = len(nums)
        return [sum(nums[j] < nums[i] for j in range(i + 1, n)) for i in range(n)]   # everything to the right
