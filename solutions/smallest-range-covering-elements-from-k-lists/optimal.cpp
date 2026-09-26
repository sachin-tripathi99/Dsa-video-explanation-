class Solution {
public:
    vector<int> smallestRange(vector<vector<int>>& nums) {
        priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>> heap;   // (value, list, index)
        int mx = INT_MIN;
        for (int i = 0; i < (int)nums.size(); i++) { heap.push({nums[i][0], i, 0}); mx = max(mx, nums[i][0]); }
        vector<int> best;
        while (true) {
            auto [lo, i, j] = heap.top(); heap.pop();        // current minimum pick
            if (best.empty() || (long long)mx - lo < (long long)best[1] - best[0]) best = {lo, mx};
            if (j + 1 == (int)nums[i].size()) return best;   // that list is exhausted
            int nx = nums[i][j + 1];
            heap.push({nx, i, j + 1});
            mx = max(mx, nx);
        }
    }
};
