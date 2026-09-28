class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        m, n = len(heights), len(heights[0])
        out = []
        for sr in range(m):
            for sc in range(n):
                seen, st, pac, atl = {(sr, sc)}, [(sr, sc)], False, False   # a full search per cell
                while st:
                    r, c = st.pop()
                    pac |= r == 0 or c == 0
                    atl |= r == m - 1 or c == n - 1
                    for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                        if 0 <= nr < m and 0 <= nc < n and (nr, nc) not in seen and heights[nr][nc] <= heights[r][c]:
                            seen.add((nr, nc))
                            st.append((nr, nc))   # downhill
                if pac and atl:
                    out.append([sr, sc])
        return out
