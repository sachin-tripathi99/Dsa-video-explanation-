from collections import deque

class Solution:
    def minimumEffortPath(self, heights: List[List[int]]) -> int:
        R, C = len(heights), len(heights[0])

        def reach(limit):
            seen = {(0, 0)}
            q = deque([(0, 0)])
            while q:
                r, c = q.popleft()
                if (r, c) == (R - 1, C - 1):
                    return True
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= nr < R and 0 <= nc < C and (nr, nc) not in seen and abs(heights[nr][nc] - heights[r][c]) <= limit:
                        seen.add((nr, nc))
                        q.append((nr, nc))
            return False

        lo, hi = 0, 10**6
        while lo < hi:                          # smallest limit that works
            mid = (lo + hi) // 2
            if reach(mid):
                hi = mid
            else:
                lo = mid + 1
        return lo
