class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        return [max(nums[s:s + k]) for s in range(len(nums) - k + 1)]
