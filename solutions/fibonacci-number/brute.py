class Solution:
    def fib(self, n: int) -> int:
        if n < 2:                            # F(0) = 0, F(1) = 1
            return n
        return self.fib(n - 1) + self.fib(n - 2)
