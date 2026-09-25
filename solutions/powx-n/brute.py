class Solution:
    def myPow(self, x: float, n: int) -> float:
        result = 1.0
        for _ in range(abs(n)):
            result *= x
        return 1.0 / result if n < 0 else result
