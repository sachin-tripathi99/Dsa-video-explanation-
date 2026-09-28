class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        def single(lo, hi):                     # best single trade in prices[lo..hi]
            low, best = float("inf"), 0
            for p in prices[lo:hi + 1]:
                low = min(low, p)
                best = max(best, p - low)
            return best

        n = len(prices)
        return max(single(0, k) + single(k, n - 1) for k in range(n))   # split day
