class Solution:
    def trap(self, height: List[int]) -> int:
        total = 0
        for i in range(len(height)):
            left = max(height[:i + 1])
            right = max(height[i:])
            total += min(left, right) - height[i]
        return total
