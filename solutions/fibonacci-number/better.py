class Solution:
    def fib(self, n: int) -> int:
        memo = {}

        def f(k: int) -> int:
            if k < 2:
                return k
            if k in memo:                  # already computed
                return memo[k]
            memo[k] = f(k - 1) + f(k - 2)
            return memo[k]

        return f(n)
