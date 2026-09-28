class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        def fewest(a):
            if a == 0:
                return 0
            best = float("inf")
            for c in coins:                     # try each coin as the last one
                if c <= a:
                    best = min(best, fewest(a - c) + 1)
            return best

        r = fewest(amount)
        return -1 if r == float("inf") else r
