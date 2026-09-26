class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        int n = heights.size(), best = 0;
        for (int i = 0; i < n; i++) {
            int l = i, r = i;
            while (l > 0 && heights[l - 1] >= heights[i]) l--;
            while (r < n - 1 && heights[r + 1] >= heights[i]) r++;
            best = max(best, heights[i] * (r - l + 1));
        }
        return best;
    }
};
