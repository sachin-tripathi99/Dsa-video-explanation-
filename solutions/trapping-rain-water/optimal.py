class Solution:
    def trap(self, height: List[int]) -> int:
        l, r = 0, len(height) - 1
        lmax = rmax = water = 0
        while l < r:
            if height[l] < height[r]:           # right wall is tall enough: l is decided by lmax
                lmax = max(lmax, height[l])
                water += lmax - height[l]
                l += 1
            else:                               # left wall is tall enough: r is decided by rmax
                rmax = max(rmax, height[r])
                water += rmax - height[r]
                r -= 1
        return water
