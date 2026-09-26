class Solution {
public:
    int trap(vector<int>& height) {
        int n = height.size(), total = 0;
        vector<int> left(n), right(n);
        for (int i = 0; i < n; i++) left[i] = max(i > 0 ? left[i - 1] : 0, height[i]);
        for (int i = n - 1; i >= 0; i--) right[i] = max(i < n - 1 ? right[i + 1] : 0, height[i]);
        for (int i = 0; i < n; i++) total += min(left[i], right[i]) - height[i];
        return total;
    }
};
