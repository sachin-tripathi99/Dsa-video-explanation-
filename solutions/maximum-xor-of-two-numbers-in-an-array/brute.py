class Solution:
    def findMaximumXOR(self, nums: List[int]) -> int:
        best = 0
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                best = max(best, nums[i] ^ nums[j])     # every pair
        return best
