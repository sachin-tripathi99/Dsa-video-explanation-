class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        r, c = 0, len(matrix[0]) - 1            # top-right corner
        while r < len(matrix) and c >= 0:
            x = matrix[r][c]
            if x == target:
                return True
            if x > target:
                c -= 1                          # column below is all bigger
            else:
                r += 1                          # row to the left is all smaller
        return False
