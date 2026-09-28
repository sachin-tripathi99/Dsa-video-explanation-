from functools import cache

class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        @cache                                  # (coin index, remaining) solved once
        def count(i, remaining):
            if remaining == 0:
                return 1
            if i == len(coins) or remaining < 0:
                return 0
            return count(i + 1, remaining) + count(i, remaining - coins[i])
        return count(0, amount)
