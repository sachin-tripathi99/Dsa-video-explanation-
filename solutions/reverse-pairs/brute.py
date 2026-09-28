class Solution:
    def reversePairs(self, nums: List[int]) -> int:
        n = len(nums)
        return sum(nums[i] > 2 * nums[j] for i in range(n) for j in range(i + 1, n))
