class Solution:
    def myPow(self, x: float, n: int) -> float:
        N = abs(n)
        result = 1.0
        while N > 0:
            if N & 1:          # this bit of n is set
                result *= x
            x *= x             # x, x^2, x^4, x^8, ...
            N >>= 1
        return 1.0 / result if n < 0 else result
