class Solution:
    def findTheWinner(self, n: int, k: int) -> int:
        pos = 0                               # winner of a circle of 1 (0-based)
        for i in range(2, n + 1):
            pos = (pos + k) % i               # shift the smaller circle's winner by k
        return pos + 1
