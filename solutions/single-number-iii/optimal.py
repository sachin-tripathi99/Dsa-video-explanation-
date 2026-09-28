class Solution:
    def singleNumber(self, nums: List[int]) -> List[int]:
        x = 0
        for y in nums:
            x ^= y                              # a ^ b
        low = x & -x                            # a bit where a and b differ
        a = b = 0
        for y in nums:
            if y & low:
                a ^= y                          # pairs cancel inside each group
            else:
                b ^= y
        return [a, b]
