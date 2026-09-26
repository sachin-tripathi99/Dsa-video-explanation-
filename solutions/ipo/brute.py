class Solution:
    def findMaximizedCapital(self, k: int, w: int, profits: List[int], capital: List[int]) -> int:
        used = [False] * len(profits)
        for _ in range(k):
            best = -1
            for i in range(len(profits)):
                if not used[i] and capital[i] <= w and (best == -1 or profits[i] > profits[best]):
                    best = i
            if best == -1:
                break                           # nothing affordable
            used[best] = True
            w += profits[best]
        return w
