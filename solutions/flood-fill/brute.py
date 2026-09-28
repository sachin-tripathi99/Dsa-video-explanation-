class Solution:
    def floodFill(self, image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:
        old = image[sr][sc]
        if old == color:
            return image
        m, n = len(image), len(image[0])
        painted = [[False] * n for _ in range(m)]
        painted[sr][sc] = True
        changed = True
        while changed:                          # sweep until nothing changes
            changed = False
            for r in range(m):
                for c in range(n):
                    if painted[r][c] or image[r][c] != old:
                        continue
                    if any(0 <= r + dr < m and 0 <= c + dc < n and painted[r + dr][c + dc] for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                        painted[r][c] = True
                        changed = True
        for r in range(m):
            for c in range(n):
                if painted[r][c]:
                    image[r][c] = color
        return image
