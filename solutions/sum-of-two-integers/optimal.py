class Solution:
    def getSum(self, a: int, b: int) -> int:
        MASK = 0xFFFFFFFF                       # imitate 32-bit integers
        a, b = a & MASK, b & MASK
        while b:
            a, b = (a ^ b) & MASK, ((a & b) << 1) & MASK   # sum without carries, carries
        return a if a <= 0x7FFFFFFF else ~(a ^ MASK)
