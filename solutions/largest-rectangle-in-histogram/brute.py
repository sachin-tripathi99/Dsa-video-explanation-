class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        n, best = len(heights), 0
        for i, h in enumerate(heights):
            l = r = i
            while l > 0 and heights[l - 1] >= h:
                l -= 1
            while r < n - 1 and heights[r + 1] >= h:
                r += 1
            best = max(best, h * (r - l + 1))
        return best
