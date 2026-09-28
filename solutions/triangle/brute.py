class Solution:
    def minimumTotal(self, triangle: List[List[int]]) -> int:
        def best(r, c):
            if r == len(triangle) - 1:
                return triangle[r][c]           # bottom row
            return triangle[r][c] + min(best(r + 1, c), best(r + 1, c + 1))
        return best(0, 0)
