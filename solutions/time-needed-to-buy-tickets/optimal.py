class Solution:
    def timeRequiredToBuy(self, tickets: List[int], k: int) -> int:
        time = 0
        for i, t in enumerate(tickets):
            if i <= k:
                time += min(t, tickets[k])
            else:
                time += min(t, tickets[k] - 1)          # k finishes first in the last round
        return time
