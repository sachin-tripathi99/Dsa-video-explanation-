class Solution:
    def numSquares(self, n: int) -> int:
        if n == 0:
            return 0
        return min(1 + self.numSquares(n - s * s) for s in range(1, int(n ** 0.5) + 1))   # last square s²
