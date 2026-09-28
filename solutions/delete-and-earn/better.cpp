class Solution {
    vector<int> memo, pts;
    int best(int x) {
        if (x < 0) return 0;
        if (memo[x] >= 0) return memo[x];                   // solved before
        return memo[x] = max(best(x - 1), best(x - 2) + pts[x]);
    }
public:
    int deleteAndEarn(vector<int>& nums) {
        int m = *max_element(nums.begin(), nums.end());
        pts.assign(m + 1, 0);
        for (int x : nums) pts[x] += x;
        memo.assign(m + 1, -1);
        return best(m);
    }
};
