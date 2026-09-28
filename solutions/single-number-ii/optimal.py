class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        ones = twos = 0                         # per-bit counter mod 3
        for x in nums:
            ones = (ones ^ x) & ~twos
            twos = (twos ^ x) & ~ones
        return ones
