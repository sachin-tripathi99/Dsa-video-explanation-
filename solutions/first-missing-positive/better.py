class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        want = 1
        for x in sorted(nums):
            if x == want:
                want += 1
            elif x > want:
                break                           # gap found
        return want
