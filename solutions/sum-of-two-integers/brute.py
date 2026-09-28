class Solution:
    def getSum(self, a: int, b: int) -> int:
        MASK = 0xFFFFFFFF                       # imitate 32-bit integers

        def inc(x):                             # x + 1 with bits
            m = 1
            while x & m:
                x ^= m
                m <<= 1
            return (x | m) & MASK

        def dec(x):                             # x − 1 with bits
            m = 1
            while not x & m and m <= MASK:
                x |= m
                m <<= 1
            return (x ^ m) & MASK

        a, b = a & MASK, b & MASK
        negative = b >> 31
        while b:                                # move one unit at a time
            if negative:
                a, b = dec(a), inc(b)
            else:
                a, b = inc(a), dec(b)
        return a if a <= 0x7FFFFFFF else a - (1 << 32)
