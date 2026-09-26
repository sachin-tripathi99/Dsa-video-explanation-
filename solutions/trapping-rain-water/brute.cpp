class Solution {
public:
    int trap(vector<int>& height) {
        int n = height.size(), total = 0;
        for (int i = 0; i < n; i++) {
            int left = 0, right = 0;
            for (int k = 0; k <= i; k++) left = max(left, height[k]);
            for (int k = i; k < n; k++) right = max(right, height[k]);
            total += min(left, right) - height[i];
        }
        return total;
    }
};
