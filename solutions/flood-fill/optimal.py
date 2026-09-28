class Solution:
    def floodFill(self, image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:
        old = image[sr][sc]
        if old == color:
            return image                        # same colour: nothing to do
        m, n = len(image), len(image[0])

        def fill(r, c):
            if r < 0 or c < 0 or r >= m or c >= n or image[r][c] != old:
                return
            image[r][c] = color                 # recolour = visited
            fill(r + 1, c); fill(r - 1, c); fill(r, c + 1); fill(r, c - 1)

        fill(sr, sc)
        return image
