class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        m, n = len(matrix), len(matrix[0])
        lo, hi = 0, m * n - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            x = matrix[mid // n][mid % n]       # virtual index → (row, col)
            if x == target:
                return True
            if x < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return False
