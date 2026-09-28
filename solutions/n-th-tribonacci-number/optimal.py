class Solution:
    def tribonacci(self, n: int) -> int:
        if n == 0:
            return 0
        a, b, c = 0, 1, 1                       # T(i−3), T(i−2), T(i−1)
        for _ in range(3, n + 1):
            a, b, c = b, c, a + b + c
        return c
