class Solution:
    def maxArea(self, height: List[int]) -> int:
        best = 0
        for l in range(len(height)):
            for r in range(l + 1, len(height)):
                best = max(best, min(height[l], height[r]) * (r - l))
        return best
