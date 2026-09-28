class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        def count(i, remaining):
            if remaining == 0:
                return 1
            if i == len(coins) or remaining < 0:
                return 0
            return count(i + 1, remaining) + count(i, remaining - coins[i])   # done with coin i, or one more
        return count(0, amount)
