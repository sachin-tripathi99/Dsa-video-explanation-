class Solution {
public:
    int trap(vector<int>& height) {
        int l = 0, r = (int)height.size() - 1, lmax = 0, rmax = 0, water = 0;
        while (l < r) {
            if (height[l] < height[r]) {            // right wall is tall enough: l is decided by lmax
                lmax = max(lmax, height[l]);
                water += lmax - height[l];
                l++;
            } else {                                // left wall is tall enough: r is decided by rmax
                rmax = max(rmax, height[r]);
                water += rmax - height[r];
                r--;
            }
        }
        return water;
    }
};
