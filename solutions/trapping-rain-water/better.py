class Solution:
    def trap(self, height: List[int]) -> int:
        n = len(height)
        left, right = [0] * n, [0] * n
        for i in range(n):
            left[i] = max(left[i - 1] if i else 0, height[i])
        for i in range(n - 1, -1, -1):
            right[i] = max(right[i + 1] if i < n - 1 else 0, height[i])
        return sum(min(left[i], right[i]) - height[i] for i in range(n))
