class Solution {
public:
    int shortestSubarray(vector<int>& nums, int k) {
        int n = nums.size(), best = INT_MAX;
        vector<long long> P(n + 1, 0);
        for (int i = 0; i < n; i++) P[i + 1] = P[i] + nums[i];
        deque<int> dq;                                      // prefix indices, P increasing
        for (int j = 0; j <= n; j++) {
            while (!dq.empty() && P[j] - P[dq.front()] >= k) { best = min(best, j - dq.front()); dq.pop_front(); }
            while (!dq.empty() && P[dq.back()] >= P[j]) dq.pop_back();   // dominated start
            dq.push_back(j);
        }
        return best == INT_MAX ? -1 : best;
    }
};
