class Solution {
    int best(vector<int>& pts, int x) {                     // best using values 0..x
        if (x < 0) return 0;
        return max(best(pts, x - 1), best(pts, x - 2) + pts[x]);
    }
public:
    int deleteAndEarn(vector<int>& nums) {
        int m = *max_element(nums.begin(), nums.end());
        vector<int> pts(m + 1, 0);
        for (int x : nums) pts[x] += x;                     // bucket points by value
        return best(pts, m);
    }
};
