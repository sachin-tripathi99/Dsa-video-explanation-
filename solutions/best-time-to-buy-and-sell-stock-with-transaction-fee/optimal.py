class Solution:
    def maxProfit(self, prices: List[int], fee: int) -> int:
        hold, cash = -prices[0], 0
        for p in prices[1:]:
            hold, cash = max(hold, cash - p), max(cash, hold + p - fee)   # buy / sell and pay the fee
        return cash
