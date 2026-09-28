class Solution:
    def maxProfit(self, k: int, prices: List[int]) -> int:
        n = len(prices)
        if 2 * k >= n:                          # limit never binds
            return sum(max(0, prices[i] - prices[i - 1]) for i in range(1, n))
        buy, sell = [-prices[0]] * k, [0] * k
        for p in prices:
            for j in range(k):
                buy[j] = max(buy[j], (sell[j - 1] if j else 0) - p)   # buy j from sell j−1
                sell[j] = max(sell[j], buy[j] + p)
        return sell[-1]
