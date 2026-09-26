class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        for row in matrix:
            i = bisect_left(row, target)
            if i < len(row) and row[i] == target:
                return True
        return False
