class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        result = 0
        for b in range(32):
            c = sum((x >> b) & 1 for x in nums)   # ones in this column
            if c % 3:
                result |= 1 << b                # the loner's bit
        return result - (1 << 32) if result >= 1 << 31 else result   # back to signed
