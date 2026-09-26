class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        out = []
        top, bottom, left, right = 0, len(matrix) - 1, 0, len(matrix[0]) - 1
        while top <= bottom and left <= right:
            for c in range(left, right + 1):
                out.append(matrix[top][c])
            top += 1
            for r in range(top, bottom + 1):
                out.append(matrix[r][right])
            right -= 1
            if top <= bottom:                   # a bottom row is still left
                for c in range(right, left - 1, -1):
                    out.append(matrix[bottom][c])
                bottom -= 1
            if left <= right:                   # a left column is still left
                for r in range(bottom, top - 1, -1):
                    out.append(matrix[r][left])
                left += 1
        return out
