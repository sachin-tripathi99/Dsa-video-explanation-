class Solution {
public:
    int maxArea(vector<int>& height) {
        int best = 0, n = height.size();
        for (int l = 0; l < n; l++)
            for (int r = l + 1; r < n; r++)
                best = max(best, min(height[l], height[r]) * (r - l));
        return best;
    }
};
