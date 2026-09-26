class Solution:
    def mySqrt(self, x: int) -> int:
        k = 0
        while (k + 1) * (k + 1) <= x:
            k += 1
        return k
