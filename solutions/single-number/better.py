class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        seen = set()
        for x in nums:
            seen ^= {x}                         # pairs cancel
        return seen.pop()
