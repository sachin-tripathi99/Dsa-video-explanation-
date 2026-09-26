class Solution:
    def findMaxAverage(self, nums: List[int], k: int) -> float:
        best = max(sum(nums[i:i + k]) for i in range(len(nums) - k + 1))
        return best / k
