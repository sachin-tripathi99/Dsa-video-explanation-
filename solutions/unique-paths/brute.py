class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        def paths(r, c):
            if r == 0 or c == 0:
                return 1                        # along an edge
            return paths(r - 1, c) + paths(r, c - 1)   # from above + from the left
        return paths(m - 1, n - 1)
