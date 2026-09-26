class Solution:
    def kthSmallest(self, matrix: List[List[int]], k: int) -> int:
        n = len(matrix)
        lo, hi = matrix[0][0], matrix[-1][-1]
        while lo < hi:
            mid = (lo + hi) // 2
            r, c, cnt = n - 1, 0, 0             # staircase from the bottom-left
            while r >= 0 and c < n:
                if matrix[r][c] <= mid:
                    cnt += r + 1
                    c += 1
                else:
                    r -= 1
            if cnt >= k:
                hi = mid
            else:
                lo = mid + 1
        return lo
