class Solution:
    def myPow(self, x: float, n: int) -> float:
        if n < 0:
            x, n = 1 / x, -n

        def power(k: int) -> float:
            if k == 0:
                return 1.0
            half = power(k // 2)             # computed once, used twice
            return half * half if k % 2 == 0 else half * half * x

        return power(n)
