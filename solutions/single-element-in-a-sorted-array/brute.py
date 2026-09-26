class Solution:
    def singleNonDuplicate(self, nums: List[int]) -> int:
        x = 0
        for v in nums:
            x ^= v                              # pairs cancel out
        return x
