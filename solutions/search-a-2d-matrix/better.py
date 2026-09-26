class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        row = bisect_right([r[0] for r in matrix], target) - 1   # last row starting <= target
        if row < 0:
            return False
        i = bisect_left(matrix[row], target)
        return i < len(matrix[row]) and matrix[row][i] == target
