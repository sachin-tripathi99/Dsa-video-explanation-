class Solution {
public:
    int shortestSubarray(vector<int>& nums, int k) {
        int n = nums.size(), best = INT_MAX;
        vector<long long> P(n + 1, 0);
        for (int i = 0; i < n; i++) P[i + 1] = P[i] + nums[i];
        for (int j = 1; j <= n; j++)
            for (int i = 0; i < j; i++)
                if (P[j] - P[i] >= k) best = min(best, j - i);
        return best == INT_MAX ? -1 : best;
    }
};
