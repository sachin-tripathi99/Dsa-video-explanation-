class Solution {
public:
    int longestSubarray(vector<int>& nums, int limit) {
        priority_queue<pair<int, int>> mx;                                          // (value, index)
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> mn;
        int l = 0, best = 0;
        for (int r = 0; r < (int)nums.size(); r++) {
            mx.push({nums[r], r});
            mn.push({nums[r], r});
            while (true) {
                while (mx.top().second < l) mx.pop();                   // lazily drop stale tops
                while (mn.top().second < l) mn.pop();
                if (mx.top().first - mn.top().first <= limit) break;
                l++;
            }
            best = max(best, r - l + 1);
        }
        return best;
    }
};
